const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Airtable configuration from environment variables
    const airtableConfig = {
      baseId: process.env.AIRTABLE_BASE_ID,
      tableId: process.env.AIRTABLE_TABLE_ID,
      apiKey: process.env.AIRTABLE_API_KEY
    };

    // Send to Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: formData
        })
      }
    );

    if (response.ok) {
      const result = await response.json();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ success: true, id: result.id })
      };
    } else {
      const error = await response.text();
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: error })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};