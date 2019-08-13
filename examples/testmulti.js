const multipart = require("parse-multipart");

var data = '--------abcde123\r\nContent-Type: application/json; charset=UTF-8; filename=\"B.txt\"\r\n\r\n{ "directive": { "header": { "namespace": "SpeechSynthesizer", "name": "Speak", "messageId": "2e142c72-25ee-4f55-b38d-62b2ce0e1f52", "dialogRequestId": "dialogRequestId-321" }, "payload": { "url": "cid:DeviceTTSRendererV4_cc28f19a-b91e-4aed-8efc-2a4d6687ccc6_192653340", "format": "AUDIO_MPEG", "token": "amzn1.as-ct.v1.Domain:Application:NotificationsV4#ACRI#DeviceTTSRendererV4_cc28f19a-b91e-4aed-8efc-2a4d6687ccc6"}}}\r\n--------abcde123\r\nContent - ID: <DeviceTTSRendererV4_cc28f19a-b91e-4aed-8efc-2a4d6687ccc6_192653340>\r\nContent-Type: application/octet-stream\r\n\r\nID3#TSSELavf57.71.100��d�*)�I0\r\n2a�\r\n�       -z�!�����ɓ&���D<G�"�2�["""3�G�w�Z"=�DF{�w���}�?����@ �N���      �C��\�.�        �����7����ա�|ǃٸ�+¨%6,-�<���d�"���_�8�4�Gfi▒▒�\r\n                                                                                                                                     �S��� VH�v͍�cS���������.L��c+�����xNTdM�g�{P�$�e�����0�����]?���|��A��4�+����Cv /��# ��䤏ʟ�▒▒6ʡ���d�!c��G�Q~���1�\r\n                                                    ��b??���\r\n--------abcde123--';
//console.log(data);

var buffer = new Buffer(data.toString(), 'utf8');
var parts = multipart.Parse(buffer, "------abcde123");


console.log('nbpart:' + parts.length);

for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    console.log("part is : %o", part);
    console.log("part is : %s", part.data);
}
