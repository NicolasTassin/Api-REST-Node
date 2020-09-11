const express = require('express')
const { success, error } = require('functions')
const morgan = require('morgan')
const config = require('./config')
const bodyParser = require('body-parser')
const app = express()




const members = [
    {
        id: 1,
        name: 'Jonh'
    },
    {
        id: 2,
        name: 'Julie'
    },
    {
        id: 3,
        name: 'Jack'
    }
]
let MembersRouter = express.Router()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

MembersRouter.route('/:id')

    .get((req, res) => {

        let index = getIndex(req.params.id)

        if (typeof(index) == 'string'){
            res.json(error(index))
        }else{
            res.json(success(members[index]))
        }


        res.json(success(members[(req.params.id) - 1]))
    })

    .put((req, res) => {
        let index = getIndex(req.params.id)

        if (typeof(index) == 'string'){
            res.json(error(index))
        }else{
            
            let same = false
            for (let i = 0; i < members.length; i++) {
                if (req.body.name == members[i].name && req.params.id !== members[i].id) {
                same = true
                break
                }
            }

            if (same){
                res.json(error('same name'))
            }else{
                members[index].name = req.body.name
                res.json(success(true))
            }
            
        
        }

    })

    .delete((req, res) => {
        let index = getIndex(req.params.id)

        if (typeof(index) == 'string'){
            res.json(error(index))
        }else{
            members.splice(index, 1)
            res.json(success(members))
        }

    })

    MembersRouter.route('/')

        .get((req, res) => {
            if (req.query.max != undefined && req.query.max > 0) {
                res.json(success(members.slice(0, req.query.max)))
            } else if (req.query.max != undefined) {
                res.json(error('Wrong max value'))
            } else {
                res.json(success(members))
            }
        })

        .post((req, res) => {
            if (req.body.name) {

                let sameName = false

                for (let i = 0; i < members.length; i++) {
                    if (members[i].name == req.body.name) {
                        sameName = true
                        break
                    }
                }
                if (sameName) {
                    res.json(error('Name already taken'))
                } else {
                    let member = {
                        id: createId(),
                        name: req.body.name
                    }
                    members.push(member)
                    res.json(success(member))

                }
            } else {
                res.json(error('No name value'))
            }
        })


app.use(config.rootAPI+members, MembersRouter)

app.listen(config.port, () => {
    console.log('Started on port' + config.port)
})

function getIndex(id) {
    for (let i = 0; i < members.length; i++) {
        if (members[i].id == id)
            return i
    }
    return ('Wrong id')
}

function createId() {
    return lastMember = members[members.length-1].id +1
}

