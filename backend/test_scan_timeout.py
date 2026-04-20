import asyncio
import time
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import HTTPException

from schemas.scan_schema import ScanRequest
from services.vulnerability_service import ScanTimeoutError, run_scan
from routes.scan import analyze_code

TEST_USER_ID = "69e53c008131a278d5cc67b4"


class ScanTimeoutTests(unittest.IsolatedAsyncioTestCase):
    async def test_run_scan_raises_timeout_error_when_analysis_exceeds_timeout(self):
        def slow_analyze(*_args, **_kwargs):
            time.sleep(0.05)
            return []

        with patch("services.vulnerability_service._SCAN_TIMEOUT_SECONDS", 0.01), patch(
            "services.vulnerability_service.analyze_code_vulnerabilities",
            side_effect=slow_analyze,
        ):
            with self.assertRaises(ScanTimeoutError):
                await run_scan(code="print('x')", language="python", user_id=None)

    async def test_run_scan_returns_response_when_analysis_completes_in_time(self):
        with patch("services.vulnerability_service._SCAN_TIMEOUT_SECONDS", 1.0), patch(
            "services.vulnerability_service.analyze_code_vulnerabilities",
            return_value=[],
        ):
            response = await run_scan(code="print('x')", language="python", user_id=None)
            self.assertIsNotNone(response.scan_id)
            self.assertEqual(response.vulnerabilities, [])

    async def test_route_returns_504_for_scan_timeout(self):
        req = ScanRequest(code="print('x')", language="python")
        user = SimpleNamespace(id=TEST_USER_ID)

        with patch("routes.scan.run_scan", side_effect=ScanTimeoutError("timed out")):
            with self.assertRaises(HTTPException) as ctx:
                await analyze_code(req, current_user=user)

        self.assertEqual(ctx.exception.status_code, 504)
        self.assertEqual(ctx.exception.detail, "timed out")


if __name__ == "__main__":
    unittest.main()
