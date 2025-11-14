# Nginx Reverse Proxy

A basic nginx web server Docker configuration.

## Usage

### Build the image
```bash
docker build -t nginx-reverse-proxy .
```

### Run the container
```bash
docker run -d -p 3001:3001 --name nginx-proxy nginx-reverse-proxy
```

### Run with custom static files
```bash
docker run -d -p 3001:3001 -v /path/to/your/html:/usr/share/nginx/html --name nginx-proxy nginx-reverse-proxy
```

## Configuration

Edit `default.conf` to customize the nginx configuration. The default configuration serves static files from `/usr/share/nginx/html`.

To use as a reverse proxy, uncomment and modify the proxy_pass section in `default.conf`.

