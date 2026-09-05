#!/usr/bin/env bash
# Run this ON THE EC2 HOST (not inside Docker), from the repo root, with sudo access.
# Installs host Nginx + Certbot, wires up visualml.xyz -> :3000 and api.visualml.xyz -> :3003,
# then obtains/renews Let's Encrypt certs and enables the HTTP -> HTTPS redirect.
#
# Usage: sudo ./deploy/setup-host-nginx.sh you@example.com
set -euo pipefail

EMAIL="${1:?Usage: $0 <email-for-lets-encrypt>}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/nginx" && pwd)"

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

cp "$SCRIPT_DIR/visualml.xyz.conf" /etc/nginx/sites-available/visualml.xyz.conf
cp "$SCRIPT_DIR/api.visualml.xyz.conf" /etc/nginx/sites-available/api.visualml.xyz.conf
ln -sf /etc/nginx/sites-available/visualml.xyz.conf /etc/nginx/sites-enabled/visualml.xyz.conf
ln -sf /etc/nginx/sites-available/api.visualml.xyz.conf /etc/nginx/sites-enabled/api.visualml.xyz.conf
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

certbot --nginx \
  -d visualml.xyz -d www.visualml.xyz -d api.visualml.xyz \
  --redirect --non-interactive --agree-tos -m "$EMAIL"

nginx -t
systemctl reload nginx

echo "Done. Certbot installed a systemd timer for auto-renewal (check: systemctl list-timers | grep certbot)."
