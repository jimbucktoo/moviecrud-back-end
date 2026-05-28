import { app } from './app'
import { config } from './config'

const port = parseInt(config.PORT, 10)

app.listen(port, () => {
    console.log(`MovieCrud server running on port ${port} [${config.NODE_ENV}]`)
})
