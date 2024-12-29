import random
import string
import time
from datetime import datetime
from locust import HttpUser, SequentialTaskSet, task, between, events

@events.request.add_listener
def log_request(request_type, name, response_time, response_length, response, context, exception, **kwargs):
    # If exception is None, request succeeded. Otherwise, it failed.
    current_time = time.strftime("[%Y-%m-%d %H:%M:%S]")
    print("----------------------------------------------------------------")
    if exception is None:
        # Success
        print(
            f"{current_time} [SUCCESS] {request_type} {name} "
            f"{response_time:.2f} ms, "
            f"STATUS: {response.status_code},\nRESPONSE: {response.text}"
        )
    else:
        # Failure
        print(
            f"{current_time} [FAILURE] {request_type} {name} "
            f"{response_time:.2f} ms, "
            f"STATUS: {response.status_code},\nRESPONSE: {response.text},\nEXCEPTION: {exception},\nRESPONSE ALL: {response}"
        )

def generate_random_email() -> str:
    """Generate a random email to avoid signup collisions."""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"user_{random_string}@test.com"

class TodoUserScenario(SequentialTaskSet):
    """
    A scenario (sequence of tasks) that a single user will execute from
    signup to logout.
    """

    def on_start(self):
        """
        Called when a Locust User starts executing this TaskSet.
        We’ll sign up and log in immediately.
        """
        self.base_url = ""  # We'll rely on self.client for the domain/port
        self.email = generate_random_email()
        self.password = "Passw0rd!"

        # Initialize tokens to None
        self.access_token = None

        self.created_todo_ids = []

        self.signup()
        self.login()

    def get_auth_header(self) -> dict:
        """
        Return the current Authorization header.
        Checks if token is expired before returning.
        If expired, refreshes the token.
        """

        return {"Authorization": f"Bearer {self.access_token}"}

    def signup(self):
        """
        Step 1: Sign up a new user.
        """
        with self.client.post(
            "/api/auth/signup/",
            data={"email": self.email, "password": self.password},
            catch_response=True
        ) as response:
            if response.status_code == 201:
                response.success()
            else:
                response.failure(f"Signup failed: {response.text}")

    def login(self):
        """
        Step 2: Log in (obtain refresh and access tokens).
        """
        with self.client.post(
            "/api/auth/token/",
            data={"username": self.email, "password": self.password},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                json_data = response.json()
                self.access_token = json_data.get("access")
                self.refresh_token = json_data.get("refresh")  # Capture the refresh token
                if not self.access_token or not self.refresh_token:
                    response.failure("Login succeeded but tokens are missing!")
                else:
                    response.success()
            else:
                response.failure(f"Login failed: {response.text}")


    @task
    def fetch_todo_items_initial(self):
        """
        Step 3: Fetch the to-do list initially.
        """
        headers = self.get_auth_header()
        with self.client.get(
            "/api/todoitems/",
            headers=headers,
            name="GET /api/todoitems/",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Fetch initial todo items failed: {response.text}")

    @task
    def create_todo_item_1(self):
        """
        Step 4a: Create the first to-do item.
        """
        headers = self.get_auth_header()
        payload = {"title": "My first todo"}
        with self.client.post(
            "/api/todoitems/",
            headers=headers,
            data=payload,
            name="POST /api/todoitems/ [create #1]",
            catch_response=True
        ) as response:
            if response.status_code == 201:
                json_data = response.json()
                self.created_todo_ids.append(json_data["id"])
                response.success()
            else:
                response.failure(f"Create first todo item failed: {response.text}")

        # Wait 1-4 seconds *after* creating an item
        time.sleep(random.uniform(1, 4))

    @task
    def create_todo_item_2(self):
        """
        Step 4b: Create the second to-do item.
        """
        headers = self.get_auth_header()
        payload = {"title": "My second todo"}
        with self.client.post(
            "/api/todoitems/",
            headers=headers,
            data=payload,
            name="POST /api/todoitems/ [create #2]",
            catch_response=True
        ) as response:
            if response.status_code == 201:
                json_data = response.json()
                self.created_todo_ids.append(json_data["id"])
                response.success()
            else:
                response.failure(f"Create second todo item failed: {response.text}")

        # Wait 1-4 seconds before fetching again
        time.sleep(random.uniform(1, 4))

    @task
    def fetch_todo_items_after_creation(self):
        """
        Step 5: Fetch the to-do list again and check if the two new items are present.
        """
        headers = self.get_auth_header()
        with self.client.get(
            "/api/todoitems/",
            headers=headers,
            name="GET /api/todoitems/ [check created]",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                todo_items = response.json()
                # Basic check that newly created items are in the list
                existing_ids = [item["id"] for item in todo_items]
                for created_id in self.created_todo_ids:
                    if created_id not in existing_ids:
                        response.failure(f"Todo item {created_id} not found in the list!")
                response.success()
            else:
                response.failure(f"Fetch todo items after creation failed: {response.text}")

        # Wait 1-4 seconds before deleting
        time.sleep(random.uniform(1, 4))

    @task
    def delete_todo_item_1(self):
        """
        Step 6a: Delete the first of the newly created to-do items.
        """
        if len(self.created_todo_ids) < 1:
            # No item to delete
            return

        todo_id = self.created_todo_ids[0]
        headers = self.get_auth_header()

        with self.client.delete(
            f"/api/todoitems/{todo_id}/",
            headers=headers,
            name="DELETE /api/todoitems/<id> [delete #1]",
            catch_response=True
        ) as response:
            if response.status_code == 204:
                response.success()
            else:
                response.failure(f"Delete todo item {todo_id} failed: {response.text}")

        # Wait 1-4 seconds
        time.sleep(random.uniform(1, 4))

    @task
    def delete_todo_item_2(self):
        """
        Step 6b: Delete the second of the newly created to-do items.
        """
        if len(self.created_todo_ids) < 2:
            # No second item to delete
            return

        todo_id = self.created_todo_ids[1]
        headers = self.get_auth_header()

        with self.client.delete(
            f"/api/todoitems/{todo_id}/",
            headers=headers,
            name="DELETE /api/todoitems/<id> [delete #2]",
            catch_response=True
        ) as response:
            if response.status_code == 204:
                response.success()
            else:
                response.failure(f"Delete todo item {todo_id} failed: {response.text}")

        # Wait 1-4 seconds before final fetch
        time.sleep(random.uniform(1, 4))

    @task
    def fetch_todo_items_after_deletion(self):
        """
        Step 7: Fetch the to-do list once more to verify items are deleted.
        """
        headers = self.get_auth_header()
        with self.client.get(
            "/api/todoitems/",
            headers=headers,
            name="GET /api/todoitems/ [check deleted]",
            catch_response=True
        ) as response:
            if response.status_code == 200:
                todo_items = response.json()
                existing_ids = [item["id"] for item in todo_items]
                for deleted_id in self.created_todo_ids:
                    if deleted_id in existing_ids:
                        response.failure(f"Deleted todo item {deleted_id} is still in the list!")
                response.success()
            else:
                response.failure(f"Fetch todo items after deletion failed: {response.text}")

        # Wait 1-4 seconds before final logout
        time.sleep(random.uniform(1, 4))

    @task
    def logout(self):
        """
        Step 8: Logout by passing the refresh token to /api/auth/logout/.
        """
        headers = self.get_auth_header()
        with self.client.post(
            "/api/auth/logout/",
            headers=headers,
            data={"refresh_token": self.refresh_token},
            name="POST /api/auth/logout/",
            catch_response=True
        ) as response:
            if response.status_code == 205:
                response.success()
            else:
                response.failure(f"Logout failed: {response.text}")

        # Once logout is done, we can stop. 
        # In a real scenario, you might let the user ramp up again or do more tasks.
        self.interrupt()

class WebsiteUser(HttpUser):
    tasks = [TodoUserScenario]
    host = "<backend-url>"
