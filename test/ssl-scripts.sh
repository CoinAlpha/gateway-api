#!/bin/bash

# generate ssl cert
openssl req -x509 -newkey rsa:4096 -keyout ../certs/server_key.pem -out ../certs/server_cert.pem -nodes -days 365 -subj "/CN=localhost/O=Server\ Certificate"
openssl req -newkey rsa:4096 -keyout ../certs/client_key.pem -out ../certs/client_csr.pem -nodes -days 365 -subj "/CN=Client"

# self-sign client cert using server key
openssl x509 -req -in ../certs/client_csr.pem -CA ../certs/server_cert.pem -CAkey ../certs/server_key.pem -out ../certs/client_cert.pem -set_serial 01 -days 365

echo 
echo "note: restart node server to load new certs"
echo

# test after restarting node server
# curl -s --insecure --key ./certs/client_key.pem --cert ./certs/client_cert.pem https://localhost:5000/api
# curl -s --insecure --key ./certs/client_key.pem --cert ./certs/client_cert.pem https://localhost:5000/terra
# curl -s --insecure --key ./certs/client_key.pem --cert ./certs/client_cert.pem https://localhost:5000/balancer

