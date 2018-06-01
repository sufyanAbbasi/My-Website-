clean:
	rm .DS_Store
publish:
	gsutil -m rsync -d -r ./ gs://www.sufy.me
