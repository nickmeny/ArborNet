
/** Interface for the data sent to the Python backend */
interface AIRequest {
  prompt: string;
}

/** Interface for the data received from the Python backend */
interface AIResponse {
  ai_response: string;
  // You might include other fields like a token count or status
}

/** Interface for potential error responses */
interface APIError {
  error: string;
}