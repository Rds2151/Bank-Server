init:
	npm init --yes
	npm i express body-parser ejs

run:
	node index.js &
	firefox http://localhost:3000/