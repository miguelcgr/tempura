
# Tempura

<br>



## Description

Time-bank: A platform where users can trade with services/skills using time (hours/minutes) as a currency.



<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **homepage** - As a user I want to be able to access the homepage and be able to login,  signup, search for services, and browse between a collection of featured services

- **sign up** - As a user I want to sign up on the web page to be able to contact with other users and post my services

- **login** - As a user I want to be able to log in on the web page so that I can get back to my account

- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account

- **edit user** - As a user I want to be able to edit my profile, add my services

- **results** - As a user I want to see the list of services filtered by keywords and request services

- **service listing** - As a user I want to see more details of the service, be able to contact the the giver.

- **service request**- The taker requests a service to the giver.

- **service agreement**-  The giver agrees to provide the service to the taker.

- **service confirmation**- The taker confirms that the service has been provided

  



<br>


## Server Routes (Back-end):



| **Method** | **Route**                     | **Description**                                              | Request  - Body                                              |
| ---------- | ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `GET`      | `/`                           | Main page route.  Renders home `index` view.                 |                                                              |
| `GET`      | `/login`                      | Renders `login` form view.                                   |                                                              |
| `POST`     | `/login`                      | Sends Login form data to the server.                         | { email, password }                                          |
| `GET`      | `/signup`                     | Renders `signup` form view.                                  |                                                              |
| `POST`     | `/signup`                     | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                        |
| `GET`      | `/private/edit-profile`       | Private route. Renders `edit-profile` form view.             |                                                              |
| `POST`     | `/private/edit-profile`       | Private route. Sends edit-profile info to server and updates the current user. | { email, password, [firstName], [lastName], [imageUrl], phoneNumber } |
| `GET`      | `/private/create-service`     | Private route. Render the create services view.              |                                                              |
| `POST`     | `/private/create-service`     | Private route. Each user can create a new service            | { name, service, location, category }                        |
| `GET`      | `/private/edit-service/:id`   | Private route. Each user can edit a service                  |                                                              |
| `POST`     | `/private/edit-service/:id`   | Private route. Each user can edit a service                  | {serviceId }                                                 |
| `POST`     | `/private/delete-service/:id` | Private route. Each user can delete a service                | {serviceId}                                                  |
| `GET`      | `/services/`                  | Renders service results view.                                |                                                              |
| `GET`      | `/services/details/:id`       | Render service details view for the particular service.      |                                                              |
| `POST`     | `/services/details/:id`       | Sends service request and takerUser that requests            | {service, takerUser, units}                                  |
| `GET`      | `/private/activity`           | Private route. Renders activity panel                        |                                                              |
| `POST`     | `/private/activity`           | Private route. Sends confirmation (will provide service)     | {user}                                                       |
| `GET`      | `/public/profile/:id`         | Renders user's public profile by id                          |                                                              |
|            |                               |                                                              |                                                              |
|            |                               |                                                              |                                                              |






## Models

User model

```javascript
{
  username: {type: String, required: true, unique: true}, 
  fname: {type: String, required: true},
  lname: {type: String, required: true},    
  email: {type: String, required: true, unique: true},  
  phone: {type: Number, required: true, unique: true},     
  balance: {type: Number, default: 0},   
  location: String,    
  password: {type: String, required: true}, 
  services: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
  swaps: {
    asTaker: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
    asGiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
    pastSwaps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Swap" }],
  },    
  notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Swap'}],      
  profilePic: {type: String, default: 'imgurl.jpg'},
  joinDate: {type: Date, default: Date.now}     
      
}

```



Services model

```javascript
{
  name: { type: String, required: true },
  description: { type: String, required: true },
  giverUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  location: String,
  duration: Number, //hours
  category: {
    type: String,
    enum: [
      "Lessons",
      "Construction & repair",
      "Care",
      "Digital services",
      "Sports & Health",
      "Food",
      "Other",
    ],
    default: "Other",
  },
  picture: [{ type: String, default: "imgurl.jpg" }],
  dateAdded: { type: Date, default: Date.now },
}

```

Swap model

```js

{
giverUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
takerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service'},
swapDuration: Number,    
giverAccept: {type: Boolean, default: false},
giverAcceptTime: {type: Date, default: undefined},   
takerConfirmation: {type: Boolean, default: false},
takerConfirmationTime: {type: Date, default: undefined}   
}
```



<br>



## Backlog

https://trello.com/b/S21Ofvgg/tempura



<br>



## Links



### Git

The url to your repository and to your deployed project

https://github.com/miguelcgr/tempura

[Deploy Link]()



<br>



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)
