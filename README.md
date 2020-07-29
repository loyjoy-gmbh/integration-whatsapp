Steps to set up a new machines for a whatsapp-business account
---------------------------------------------

- Create new Postgres10 Database in GCloud.
- Set allowed network to `0.0.0.0/0` for DB
- Create new Compute Engine instance in GCloud with whatsapp template.
- Set static IP for VM.
- SSH to machine and execute `git clone https://github.com/loyjoy-gmbh/integration-whatsapp.git && cd integration-whatsapp`
- Fill env variables with `vi startup-script.sh`
- Execute startup-script with `chmod +x ./startup-script.sh && source ./startup-script.sh`
- Check whether containers are running `docker ps`
- Import Postman Collection & Postman Env into Postman.
- Set the URL environment variable to VM's url in Postman.
- For the first login the admin credentials needs to be set. The default admin login is username: `admin` with password: `secret`. That results in the base64 encoded string `YWRtaW46c2VjcmV0`. Set this token in the environment with the key `Base64AdminCredentials`. Remember to set a secure password in body.
- Retrieve token and paste it into `AdminAuthToken` of environment variables in Postman.
- Register Phone number (02-Registration > Requst-Code):  Request-Code { "cc": "49", "phone_number": "<number>", "method": "sms", cert: "<cert>" }
- Validate account with the code you received via sms (02-Registration > Register-Account).
- Specify wekhook in 01-Settings > Application > Update-Settings.
- Create user in 00-Users > Create-User with username and password
- Set username, password and hostname in LoyJoy.
