<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Alternative GET method for restrictive servers
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['data'])) {
    $data = json_decode(urldecode($_GET['data']), true);
} else {
    // Try POST method first
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // Fallback to POST data
        $data = $_POST;
    }
}

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'No data received', 'method' => $_SERVER['REQUEST_METHOD']]);
    exit;
}

// Your Slack webhook URL (keep this secure on the server)
$slackWebhookUrl = 'YOUR_SLACK_WEBHOOK_URL_HERE';

// Create Slack message format
$slackMessage = [
    'text' => '🆕 *New Label Design Request!*',
    'blocks' => [
        [
            'type' => 'header',
            'text' => [
                'type' => 'plain_text',
                'text' => '🏷️ New Label Design Request'
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*👤 Customer:*\n' . ($data['fullName'] ?: 'Not provided')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*📞 Phone:*\n' . ($data['phoneNumber'] ?: 'Not provided')
                ]
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*🏷️ Product Name:*\n' . ($data['productName'] ?: 'Not provided')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*🎨 Colors:*\n' . ($data['colors'] ?: 'Not provided')
                ]
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*📦 Weight/Volume:*\n' . ($data['weightVolume'] ?: 'Not provided')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*📏 Dimensions:*\n' . ($data['labelDimensions'] ?: 'Not provided')
                ]
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*🧪 Ingredients:*\n' . ($data['ingredients'] ?: 'Not provided')
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*📅 Manufacturing Date:*\n' . ($data['manufacturingDate'] ?: 'Not provided')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*⏰ Expiry Date:*\n' . ($data['expiryDate'] ?: 'Not provided')
                ]
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*🏭 Batch Number:*\n' . ($data['batchNumber'] ?: 'Not provided')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*🌍 Country of Origin:*\n' . ($data['countryOrigin'] ?: 'Not provided')
                ]
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*🏢 Manufacturer Details:*\n' . ($data['manufacturerDetails'] ?: 'Not provided')
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*📖 Directions for Use:*\n' . ($data['directionsUse'] ?: 'Not provided')
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*🏪 Storage Instructions:*\n' . ($data['storageInstructions'] ?: 'Not provided')
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*⚠️ Special Considerations:*\n' . ($data['specialConsiderations'] ?: 'Not provided')
            ]
        ],
        [
            'type' => 'section',
            'fields' => [
                [
                    'type' => 'mrkdwn',
                    'text' => '*✅ Terms Accepted:*\n' . ($data['termsAccepted'] ? 'Yes' : 'No')
                ],
                [
                    'type' => 'mrkdwn',
                    'text' => '*🕒 Submitted:*\n' . date('Y-m-d H:i:s')
                ]
            ]
        ],
        [
            'type' => 'section',
            'text' => [
                'type' => 'mrkdwn',
                'text' => '*📎 Files Uploaded:*\n' . ($data['filesSummary'] ?: 'No files uploaded')
            ]
        ]
    ]
];

// Send to Slack
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $slackWebhookUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($slackMessage));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Return response
if ($httpCode === 200) {
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to submit form', 'slack_response' => $response]);
}
?>