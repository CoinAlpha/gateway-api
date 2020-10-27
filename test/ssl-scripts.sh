#!/bin/bash

##### Server Ceritification Creation #####
##########################################

# CA configuration file: ca.cnf

# create a new certificate authority using this configuration.
# we now have our certificate authority in ca_key.pem and ca_cert.pem
openssl req -new -x509 -days 9999 -config ./conf/ca.cnf -keyout ../certs/ca_key.pem -out ../certs/ca_cert.pem

# generate a private key for the server.
openssl genrsa -out ../certs/server_key.pem 4096

# generate a certificate signing request
openssl req -new -config ./conf/server.cnf -key ../certs/server_key.pem -out ../certs/server_csr.pem

# sign the request.
openssl x509 -req -extfile ./conf/server.cnf -days 999 -passin "pass:password" -in ../certs/server_csr.pem -CA ../certs/ca_cert.pem -CAkey ../certs/ca_key.pem -CAcreateserial -out ../certs/server_cert.pem


##### Client Ceritification Creation #####
##########################################

# create client key
openssl genrsa -out ../certs/client_key.pem 4096

# create certificate signing requests.
openssl req -new -config ./conf/client.cnf -key ../certs/client_key.pem -out ../certs/client_csr.pem

# sign new client certs.
openssl x509 -req -extfile ./conf/client.cnf -days 999 -passin "pass:password" -in ../certs/client_csr.pem -CA ../certs/ca_cert.pem -CAkey ../certs/ca_key.pem -CAcreateserial -out ../certs/client_cert.pem

# verify our certs
echo
echo "verifying server certs"
echo
openssl verify -CAfile ../certs/ca_cert.pem ../certs/server_cert.pem
echo
echo "verifying client certs"
openssl verify -CAfile ../certs/ca_cert.pem ../certs/client_cert.pem
echo


echo 
echo "note: restart node server to load new certs"
echo

# test after restarting node server
# use -v to see details in verbose mode
# curl --insecure --key ../certs/client_key.pem --cert ../certs/client_cert.pem https://localhost:5000/api
# curl --insecure --key ../certs/client_key.pem --cert ../certs/client_cert.pem https://localhost:5000/terra
# curl --insecure --key ../certs/client_key.pem --cert ../certs/client_cert.pem https://localhost:5000/balancer

