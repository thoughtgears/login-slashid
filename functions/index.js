export async function onRequest(context) {
  const url = context.request.url.toString();
  console.log(`Incoming URL: ${url}`);

  // Determine the target URL based on specific logic
  const targetUrl = getTargetUrl(url);

  if (targetUrl) {
    // Create a new request with the modified URL
    const modifiedRequest = new Request(targetUrl.toString(), {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
      redirect: "manual",
    });

    console.log(`Fetching URL: ${targetUrl.toString()}`);

    // Fetch the response from the target server
    const response = await fetch(modifiedRequest);

    console.log(`Response status: ${response.status}`);
    console.log(`Response content-type: ${response.headers.get("content-type")}`); // Corrected typo

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location) {
        console.log(`Redirecting to: ${location}`);
        return Response.redirect(location, response.status);
      }
    }

    // Create a new response to return to the client, including all headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,

    });
  } else {
    // Handle cases where no target URL is matched
    // (You might want to return a default response or an error here)
    return new Response("No matching target URL found", {status: 404});
  }
}

// Function to determine the target URL based on URL patterns
function getTargetUrl(url) {
  if (url.includes("sdk.html")) {
    return new URL(url.pathname.replace("/cdn", ""), "https://cdn.slashid.com");
  } else if (url.includes("_astro")) {
    return new URL(url.pathname.replace("/cdn", ""), "https://cdn.slashid.com");
  } else if (url.includes("/login-page")) {
    return new URL(url.pathname + url.search, "https://api.slashid.com");
  } else {
    return null; // No matching pattern
  }
}
