Steps to set up a new machines for a whatsapp-business account
---------------------------------------------

1. Create new Postgres10 Database in GCloud.
2. Create new Compute Engine instance in GCloud with whatsapp template.
3. Set static IP for VM.
4. SSH to machine and execute `git clone https://github.com/uwol/loyjoy-public.git && cd loyjoy-public/whatsapp-business`
5. Fill env variables with `vi startup-script.sh`
6. Execute startup-script with `chmod +x ./startup-script.sh && source ./startup-script.sh`
7. Check whether containers are running `docker ps`
8. Import Postman Collection & Postman Env into Postman.
9. Set the URL environment variable to VM's url in Postman.
10. For the first login the admin credentials needs to be set. The default admin login is username: `admin` with password: `secret`. That results in the base64 encoded string `YWRtaW46c2VjcmV0`. Set this token in the environment with the key `Base64AdminCredentials`. Remember to set a secure password in body.
11. Retrieve token and paste it into `AdminAuthToken` of environment variables in Postman.
12. Register Phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "<number>", "method": "sms", cert: "<cert>" }
13. Validate account with the code you received via sms (02-Registration > Register-Account).
14. Specify wekhook in 01-Settings > Application > Update-Settings.
15. Set whatsapp username, password and hostname in LoyJoy.
