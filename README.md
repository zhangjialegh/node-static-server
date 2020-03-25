# Install
```bash
yarn && npm link
```

# Usage
```bash
nodes [--port, {port},--dist, {distpath}, --proxy, {proxy0}={PROXY}]
```

# Example

```bash
nodes --port 5000 --dist /src/project/dist --proxy api=https://www.a.com --proxy file=https://www.b.com
```

It means start static server in `/srv/project/dist`, the port is `5000`, request root `/api` proxy_pass to `https://www.a.com`,  root `/file` proxy to `https://www.b.com`
