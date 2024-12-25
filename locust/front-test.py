from locust import HttpUser, task, between

class NginxUser(HttpUser):
    # Simulate a wait time between tasks
    host = "<frontend-url>"
    wait_time = between(1, 3)

    @task
    def get_homepage(self):
        self.client.get("/")
