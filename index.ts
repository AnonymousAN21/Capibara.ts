//just testing
// import { capi } from "./capi/main/capi";

// const users: string[] = [];
// capi.use((req, res, next) => {
//     console.log("this was use middleware")
//     next();
// })

// capi.post("/test", (req, res, next) => {
//     res.testStart();
//     if(req.headers.authorization !== "andrew"){
//         return res.status(401).json({ error: "Unauthorized" })
//     }
//     next();
// }, (req, res) => {
//     const {username} = req.body;

//     if(!username)
//         return res.status(400).json({error: "No Username"});

//     for(let i = 0; i < users.length; i++){
//         if(users[i] == username){
//             return res.status(422).json({error: "Username Has been used"})
//         }
//     }
//     users.push(username);
//     res.status(200).testEnd("Inserted!!")
// })

// capi.get("/test", (req, res, next) => {
//     console.log("middleware");
//     next();
// }, (req, res) => {
//     res.status(200).json({users : users});//
// }
// )
// capi.start(3000, '')