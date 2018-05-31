clean:
    rm .DS_Store
publish:
    gsutil rsync -modr ./ gs://www.sufy.me
