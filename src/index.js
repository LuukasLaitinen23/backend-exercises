import http from 'http';
const hostname = '127.0.0.1';
const port = 3000;

let items = [
  {
    id: 1,
    name: 'first item',
  },
];

const calculate = (operation, number1, number2) => {
  if (operation === 'add') {
    return number1 + number2;
  }
  if (operation === 'subtract') {
    return number1 - number2;
  }
  if (operation === 'multiply') {
    return number1 * number2;
  }
  if (operation === 'divide') {
    return number1 / number2;
  }
};

const mathCalculator = (req, res) => {
  const operation = req.url.split('/')[2];
  const number1 = Number(req.url.split('/')[3]);
  const number2 = Number(req.url.split('/')[4]);

  const result = calculate(operation, number1, number2);

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(
    JSON.stringify({
      operation,
      number1,
      number2,
      result,
    }),
  );
  res.end();
};

const notFound = (res) => {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write(
    JSON.stringify({
      error: 'item not found',
    }),
  );
  res.end();
};

const server = http.createServer((req, res) => {
  const resource = req.url.split('/')[1];

  if (req.method === 'GET' && resource === 'calculate') {
    mathCalculator(req, res);
    return;
  }

  const id = Number(req.url.split('/')[2]);
  
  if (req.method === 'GET' && resource === 'items') {
    if (!id) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(items));
      res.end();
      return;
    }
    const item = items.find((item) => item.id === id);
    if (item) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(item));
      res.end();
      return;
    }
    notFound(res);
  }

  if (req.method === 'POST' && resource === 'items') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const requestData = JSON.parse(body);

      const newItem = {
        id: items[items.length - 1].id + 1,
        name: requestData.name,
      };

      items.push(newItem);

      res.writeHead(201, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(newItem));
      res.end();
    });
  }

  if (req.method === 'DELETE' && resource === 'items') {
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      notFound(res);
      return;
    }

    items.splice(itemIndex, 1);

    res.writeHead(204, {'Content-Type': 'application/json'});
    res.end();
  }

  if (req.method === 'PUT' && resource === 'items') {
    const item = items.find((item) => item.id === id);

    if (!item) {
      notFound(res);
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const newData = JSON.parse(body);

      item.name = newData.name;

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(item));
      res.end();
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
