//exporting required 
require('dotenv').config()
const express= require('express')
const app= express()
const scanRouter= require('./routes/scan')
//middlewares
app.use(express.json())
//routers
app.use('/scan',scanRouter)

app.get('/health',(req,res) => {
  res.json({status:"threat radar api is working"})
}
)

const PORT=  process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`threat radar app is listening at ${PORT}`)
}
)