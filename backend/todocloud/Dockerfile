# Start from a minimal and secure base image
FROM python:3.12-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies required for building Python packages
# (Adjust depending on your needs, e.g. psycopg2, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files first for efficient caching
COPY requirements.txt .

# Install Python dependencies (no cache)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Use a second stage to reduce final image size
FROM python:3.12-slim AS final

WORKDIR /app

# Install runtime dependencies only (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed site-packages and code from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

# Set environment variables that don't contain secrets
ENV DJANGO_SETTINGS_MODULE=todocloud.settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Run the Django app with gunicorn by default
CMD ["gunicorn", "todocloud.wsgi:application", "--bind", "0.0.0.0:8000"]
