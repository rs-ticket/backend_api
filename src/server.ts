import app from '@app';

import connectDB from '@config/database'

connectDB()


app.get("/", (req, res) => {
    var data = {
        status: 200,
        message: "Hello World!"
    }
//   res.send("Hello World!");
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
