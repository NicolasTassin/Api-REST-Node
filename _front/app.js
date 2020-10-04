const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const twig = require('twig')
const axios = require('axios')


const app = express()
const port = 8081
const fetch = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
    
  });

//Middlewares

app.use(morgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//Routes

//Index

app.get('/', (req, res) =>{
    res.redirect('/members')
})

//Get all members

app.get('/members', (req, res) => {
    apiCall(req.query.max ?'/members?max='+req.query.max : '/members' ,'get', {}, res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
})

//Get member with ID

app.get('/members/:id', (req, res) => {
    apiCall('/members/'+req.params.id,'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result
        })
    })
})

//Update member
app.get('/edit/:id', (req, res) => {
    apiCall('/members/'+req.params.id, 'get', {}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
})

app.post('/edit/:id', (req, res) => {
    apiCall('/members/'+req.params.id, 'put', {
        name: req.body.name
    }, res, () => {
        res.redirect('/members')
    })
})


app.listen(port, () => console.log('starts on port ' + port))


function renderError(res, errMsg) {
    res.render('error.twig', {
        errorMessage: errMsg
    })
}

function apiCall(url, method, data,  res, next) {
    fetch({
        method: method,
        url: url,
        data: data
    }).then((response) => {
        if(response.data.status == 'success'){
            next(response.data.result)
        }else{
            renderError(res, response.data.message)
        }
    })
    .catch((err) => renderError(res, err.message))

}