// Asynchronous function to refresh the Dropbox access token
export async function refreshAccessToken(): Promise<string> {
  // Send a POST request to the Dropbox OAuth2 token endpoint to refresh the access token
  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.DROPBOX_REFRESH_TOKEN!,
      client_id: process.env.DROPBOX_KEY!,
      client_secret: process.env.DROPBOX_SECRET!,
    }),
  });

  // Parse the response body as JSON
  const data: any = await response.json();

  // If the response status is not OK (i.e., not in the 200-299 range), throw an error
  if (!response.ok) {
    throw new Error(`Error refreshing access token: ${response.statusText}`);
  }

  //return new access token
  return data.access_token;
}
