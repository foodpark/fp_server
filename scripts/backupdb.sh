d=$(date +%Y-%m-%d_%H-%M-%S)

echo "Backing up db with timestamp $d..."

sudo -S pg_dump -U postgres sfezdb -f ../db/backup/backup_$d.sql

echo "Done backing up..."

