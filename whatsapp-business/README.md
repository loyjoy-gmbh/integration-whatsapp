Steps to set up a new machines for a whatsapp-business account
---------------------------------------------

1. Create new Postgres10 Database in GCloud
2. Create new Compute Engine instance in GCloud with whatsapp template
3. Execute startup-script.sh in compute engine
4. Import Postman Collection & Postman Env into Postman
5. Set the URL environment variable to VM's url in Postman
6. For the first login the admin credentials needs to be set. The default admin login is username: `admin` with password: `secret`. That results in the base64 encoded string `YWRtaW46c2VjcmV0`. Set this token in the environment with the key `Base64AdminCredentials`. Remember to set a secure password in body
7. Retrieve token and paste it into `AdminAuthToken` of environment variables in Postman
8. Register Phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "15258768765", "method": "sms", cert: "--cert--" }
9. Validate account with the code you received via sms (02-Registration > Register-Account)
10. Specify wekhook in 01-Settings > Application > Update-Settings
11. Set whatsapp username and password and Hostname in LoyJoy
