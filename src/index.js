//exporting required 
require('dotenv').config()
const express= require('express')
const app= express()
const scanRouter= require('./routes/scan')
const cors= require('cors')
//middlewares
app.use(cors({
  origin: 'http://localhost:5173'
}))
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