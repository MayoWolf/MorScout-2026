exports.handler = async (event) => {
  const { path } = event.queryStringParameters;
  const TBA_KEY = process.env.VITE_TBA_API_KEY || process.env.TBA_API_KEY;

  if (!TBA_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TBA API Key not configured on server." })
    };
  }

  try {
    const response = await fetch(`https://www.thebluealliance.com/api/v3${path}`, {
      headers: { "X-TBA-Auth-Key": TBA_KEY }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `TBA returned ${response.status}` })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
