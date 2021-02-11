

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



| **Method** | **Route**                  | **Description**                                              | Request  - Body                                              |
| ---------- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `GET`      | `/`                        | Main page route.  Renders home `index` view.                 |                                                              |
| `GET`      | `/login`                   | Renders `login` form view.                                   |                                                              |
| `POST`     | `/login`                   | Sends Login form data to the server.                         | { email, password }                                          |
| `GET`      | `/signup`                  | Renders `signup` form view.                                  |                                                              |
| `POST`     | `/signup`                  | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                        |
| `GET`      | `/private/edit-profile`    | Private route. Renders `edit-profile` form view.             |                                                              |
| `POST`     | `/private/edit-profile`    | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, [firstName], [lastName], [imageUrl], phoneNumber } |
| `GET`      | `/private/create-service`  | Private route. Render the create services view.              |                                                              |
| `POST`     | `/private/create-service/` | Private route. Each user can create a new service            | { name, service, location, category }                        |
| `GET`      | `/private/edit-service`    | Private route. Each user can edit a service                  |                                                              |
| `POST`     | `/private/edit-service`    | Private route. Each user can edit or delete a service        | {serviceID, }                                                |
| `GET`      | `/services`                | Renders service results view.                                |                                                              |
| `GET`      | `/services/details/:id`    | Render service details view for the particular service.      |                                                              |
| `POST`     | `/services/details/:id`    | Sends service request and takerUser that requests            | {new swap with Service, takerUser, units, duration}          |
| `GET`      | `/private/activity`        | Private route. Renders activity panel                        |                                                              |
| `POST`     | `/private/activity`        | Private route. Sends confirmation (will provide service)     | {pending exchange , add userGiver}                           |
| `GET`      | `/public/profile`          | Renders user's public profile                                |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |
|            |                            |                                                              |                                                              |







## Models

User model

```javascript
{
  name: String,
  email: String,
  phone: Number,    
  balance: Number,   
  location: String    
  password: String,
  services: [{}],
  requests: [
     asTaker:[{swaps}],
     asGiver: [{swaps}],
     toConfirm: [{}]
  ],    
  pendingActions: [],    
  recordSwaps:[swaps],    
  profilePic: img    
      
}

```



Services model

```javascript
{
  name: String,  
  description: String,
  giverUser: String,
  location: String,
  duration: Number,    
  category: String,    
  picture: [pics]
}

```

Swap model

```js

{
 giverUser: _id (user),
takerUser: _id (user),
service: _id (service),
swapDuration: duration * requested units,
giverAccept: boolean,
giverAcceptTime: Date,
takerConfirmation: boolean,
takerConfirmationTime: Date
}
```



<br>



## Backlog

[See the Trello board.](https://trello.com/b/Ni3giVKf/ironhackproject)



<br>



## Links



### Git

The url to your repository and to your deployed project

[Repository Link]()

[Deploy Link]()



<br>



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)