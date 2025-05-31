const express=require("express")
const { blogs, users } = require("./model/index")
const app=express()

//bcrypt require garako meroo vaii!!
const bcrypt=require("bcryptjs")

//Ma Ejs use garna lagako j j hunxa sab melaii day la mero vaii
app.set("view engine","ejs")

//yo vanko xai input feild bata data tan la vanra kam aarako!!
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//yo xaii hamro model require garako!!
require('./model/index')

//abo hami lay data base ko data home ma dekhaunay vayako lay hami data ya fetch garxum!!(READ)
app.get('/',async(req,res)=>{
const blogss= await blogs.findAll()//find all vanako xaii select * from blogs Sequilize lay function bani denxa findAll() tesk help lay garda xito hunxa
console.log(blogss)// array ko vitra obj ko form ma data deyoo!!


    res.render('home.ejs',{blogs:blogss})
})

app.get('/createBlog',(req,res)=>{
    res.render('CreateBlog.ejs')
})




// Yo xai  Api banako la !!  (CREAT)
app.post('/createBlog', async (req, res) => {

        //destructure garako body ko tittle lai lena 
        const { title, subTittle, description } = req.body;

              // Create the blog post
        await blogs.create({
            title:title,
            subTittle:subTittle,
            description:description,
        });

        console.log(req.body);
        res.redirect('/');
   
});
//Single page By id single blog
app.get('/description/:id',async(req,res)=>{
    console.log(req.params.id)
    const {id}= req.params

    const blogss= await blogs.findAll({
        where: {
            id:id
        }
    })
console.log (blogss)
    res.render('description.ejs',{blogs:blogss})
})
//delete the Blogs 
app.get('/description/delete/:id',async(req,res)=>{
    console.log(req.params.id);
    const{id}=req.params

    const blogss= await blogs.destroy({
        where:{
            id:id
        }
    })

    res.redirect('/')
})
//edit for filling the form
app.get('/edit/:id',async(req,res)=>{
    console.log(req.params.id)
    const {id}= req.params

    const blogss= await blogs.findAll({
        where: {
            id:id
        }
    })
     res.render('editBlog',{blogs:blogss});
})
//edit vanko xai form update vaye sakayr apost garna laiii!
app.post('/description/edit/:id', async (req, res) => {
    const{id}=req.params
    const { title, subTittle, description } = req.body;

    // Update the blog entry with the specified ID
    await blogs.update(
        {
            title: title,
            subTittle: subTittle,
            description: description,
        },
        {
            where: { id:id } // Specify the condition for the update
        }
    );

    console.log(req.body);
    res.redirect('/');
});






//Register Render here
app.get('/register',(req,res)=>{
    res.render("register")
})

//Register Process goes here
app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body

    await users.create({
        username:username,
        email:email,
        password:bcrypt.hashSync(password,8)
    });

    console.log(req.body);
    res.redirect('/login');


})


//Login haiii
app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const emailExist = await users.findAll({
            where: {
                email: email
            }
        });

        // Checking if user exists
        if (emailExist) {
           
            const isMatch = bcrypt.compareSync(password, emailExist.password);

            
            console.log("Password match status:", isMatch);

            if (isMatch) {
                res.redirect('/');
            } else {
                res.send("Invalid Email or Password!");
            }
        } else {
            res.send("Invalid Email or Password!");
        }
    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
});



app.listen(3000,()=>{
    console.log ("NodeJs project has been Started!")
})