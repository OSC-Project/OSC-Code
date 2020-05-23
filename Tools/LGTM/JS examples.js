var obj = {
  eval : eval
};

data = 'console.log("Hello");';

obj['eval'].call(data);

obj['eval'].apply(data);

obj['eval'](data);


setTimeout(data, 1000);

setInterval(data, 1000);

Function(){return data;};





cp = require('child_process');

cp.exec('ls;'+data,
function (err, dat) {
  console.log('err: ', err)
  console.log('data: ', dat);
});
