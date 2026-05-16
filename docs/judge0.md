# Judge0 Code Submission API

## Submit Code

### Feature

Submit source code for execution using Judge0. The code is executed and returns the output along with execution details.

### Endpoint

- Method: `POST`
- Path: `/judge0/submit`
- Full URL: `http://localhost:8046/api/v1/judge0/submit`

### Request

Headers:

- `Content-Type: application/json`

Body:

```json
{
  "source_code": "string",
  "language_id": 0,
  "stdin": "string (optional)",
  "expected_output": "string (optional)"
}
```

### Request Fields

- `source_code` (string, required): The source code to be executed
- `language_id` (integer, required): The programming language ID (see Judge0 language IDs below)
- `stdin` (string, optional): Standard input for the program
- `expected_output` (string, optional): Expected output for comparison

### Common Language IDs

| Language   | ID  |
| ---------- | --- |
| C          | 50  |
| C++        | 54  |
| Java       | 62  |
| Python     | 71  |
| JavaScript | 63  |
| Go         | 60  |
| Ruby       | 72  |
| PHP        | 68  |
| C#         | 51  |

For complete list, refer to Judge0 documentation: https://ce.judge0.com/languages

### Responses

#### 200 OK

Successful execution:

```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "token": "",
    "stdout": "Hello, World!\n",
    "stderr": null,
    "compile_output": null,
    "message": null,
    "time": "0.001",
    "memory": 512,
    "status_id": 3,
    "status_description": "Accepted"
  }
}
```

Runtime error:

```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "token": "",
    "stdout": null,
    "stderr": "Traceback (most recent call last):\n  File \"main.py\", line 1, in <module>\n    print(x)\nNameError: name 'x' is not defined\n",
    "compile_output": null,
    "message": null,
    "time": "0.002",
    "memory": 256,
    "status_id": 12,
    "status_description": "Runtime Error (NZEC)"
  }
}
```

Compilation error:

```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "token": "",
    "stdout": null,
    "stderr": null,
    "compile_output": "main.cpp:1:1: error: expected ';' before 'int'\n    1 | int main() {\n      | ^~~\n",
    "message": null,
    "time": null,
    "memory": null,
    "status_id": 6,
    "status_description": "Compilation Error"
  }
}
```

#### 400 Bad Request

Invalid request format:

```json
{
  "success": false,
  "message": "Invalid request format: Key: 'SubmitCodeRequest.SourceCode' Error:Field validation for 'SourceCode' failed on the 'required' tag"
}
```

#### 500 Internal Server Error

Failed to communicate with Judge0 or internal error:

```json
{
  "success": false,
  "message": "Failed to submit code"
}
```

### Response Fields

- `token` (string): Submission token (empty when using wait=true)
- `stdout` (string, nullable): Standard output of the program
- `stderr` (string, nullable): Standard error output
- `compile_output` (string, nullable): Compilation output (for compiled languages)
- `message` (string, nullable): Additional message from Judge0
- `time` (string, nullable): Execution time in seconds
- `memory` (integer, nullable): Memory usage in KB
- `status_id` (integer): Status code from Judge0
- `status_description` (string): Human-readable status description

### Common Status IDs

| Status ID | Description             |
| --------- | ----------------------- |
| 1         | In Queue                |
| 2         | Processing              |
| 3         | Accepted                |
| 4         | Wrong Answer            |
| 5         | Time Limit Exceeded     |
| 6         | Compilation Error       |
| 7         | Runtime Error (SIGSEGV) |
| 8         | Runtime Error (SIGXFSZ) |
| 9         | Runtime Error (SIGFPE)  |
| 10        | Runtime Error (SIGABRT) |
| 11        | Runtime Error (NZEC)    |
| 12        | Runtime Error (Other)   |
| 13        | Internal Error          |
| 14        | Exec Format Error       |

For complete list, refer to Judge0 documentation: https://ce.judge0.com/statuses

### Example Requests

#### Python Hello World

```bash
curl -X POST http://localhost:8046/api/v1/judge0/submit \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "print(\"Hello, World!\")",
    "language_id": 71
  }'
```

#### C++ with Input

```bash
curl -X POST http://localhost:8046/api/v1/judge0/submit \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}",
    "language_id": 54,
    "stdin": "5 3"
  }'
```

#### JavaScript with Expected Output

```bash
curl -X POST http://localhost:8046/api/v1/judge0/submit \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "console.log(2 + 2);",
    "language_id": 63,
    "expected_output": "4"
  }'
```

### Notes

- The endpoint uses Judge0's `wait=true` parameter, which means the response will wait for execution to complete
- Maximum execution time depends on Judge0 configuration
- The Judge0 service must be running locally at the URL specified in `JUDGE0_BASE_URL` environment variable (default: http://localhost:2358)
- Authentication is not required for this endpoint (public access)
