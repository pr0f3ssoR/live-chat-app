from locust import HttpUser, task, between
import random


BASE_URL = "http://localhost:8000"

TEST_USER = {
    "email": "test@example.com",
    "password": "123"
}

class ChatUser(HttpUser):
    wait_time = between(1, 3)
    token = None
    conversation_id = None

    # ─── Lifecycle ────────────────────────────────────────────

    def on_start(self):
        self._login()
        # self._seed_conversation()

    def _login(self):
        """Authenticate and store JWT."""
        resp = self.client.post(
            "/auth/login",
            json=TEST_USER,
            name="/auth/login"
        )
        if resp.status_code == 200:
            self.token = resp.json()["token"]
            print('token is:')
            print(self.token)

    def _seed_conversation(self):
        """Get or create a conversation to use in tasks."""
        resp = self.client.post(
            "/conversations",
            json={"participant_id": "some-user-uuid"},
            headers=self.auth_headers(),
            name="/conversations [seed]"
        )
        if resp.status_code in (200, 201):
            self.conversation_id = resp.json()["id"]

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"}
    

    @task(1)
    def get_profile(self):
        self.client.get(
            url= f'{BASE_URL}/api/u',
            headers= self.auth_headers()
        )