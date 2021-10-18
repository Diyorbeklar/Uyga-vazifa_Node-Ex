const fs = require("fs/promises");
const path = require("path");
const slugify = require('slugify');

module.exports = class CourseController {
    static async CoursesGET(req, res) {
        let dbPath = path.join(__dirname, "..", "Database", "db.json");
        let db = await fs.readFile(dbPath, "utf-8");
        db = await JSON.parse(db);
        let orders = db.orders
        res.status(200).json({
            ok: true,
            orders
        })
    }
    static async СoursePOST(req, res) {
        const {id ,user_id ,time, course_name} = req.body;

        let dbPath = path.join(__dirname, "..", "Database", "db.json");
        let db = await fs.readFile(dbPath, "utf-8");
        db = await JSON.parse(db);

        let slug = slugify(course_name, { remove: /[*+~.()'"!:@]/g, lower: true})

        let order = db.orders.find(el => el.slug === slug)
        
        if(order) {
            res.status(400).json({
                ok: false,
                message: "This book is already exists"
            })
            return 
        }
        
       
        const d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let nowTime = `${hours} : ${minutes} `
        order = {
            id: db.orders.length + 1,
            user_id ,
            time: nowTime , 
            course_name,
            course_id,
            slug
        };

        db.orders.push(order);

        await fs.writeFile(dbPath, JSON.stringify(db));

        res.status(201).json({
            ok: true,
            message: "Created",
            order
        })
    }
    static async CourseGET(req, res) {
        const {slug} = req.params;

        let dbPath = path.join(__dirname, "..", "Database", "db.json");
        let db = await fs.readFile(dbPath, "utf-8");
        db = await JSON.parse(db);

        let order = db.orders.find(el => el.slug === slug);

        if(!order) {
            res.status(400).json({
                ok: false,
                message: "Invalid Book slug"
            })
            return
        }

        res.status(200).json({
            ok: true,
            order
        })
        
    }

    static async CoursePATCH(req, res) {
        let dbPath = path.join(__dirname, "..", "Database", "db.json");
        let db = await fs.readFile(dbPath, "utf-8");
        db = await JSON.parse(db);

        let slug = slugify(req.params.slug, { remove: /[*+~.()'"!:@]/g, lower: true})

        let order = db.orders.find(el => el.slug === slug)
        
        if(!order) {
            res.status(400).json({
                ok: false,
                message: "Invalid book"
            })
            return 
        }


        order = {...order, ...req.body}

        let orderIndex = db.orders.findIndex(el => el.slug ===order.slug);

        if(req.body.course_name) {
           order.slug = slugify(req.body.course_name, { remove: /[*+~.()'"!:@]/g, lower: true})
        }

        db.orders[orderIndex] =order

        await fs.writeFile(dbPath, JSON.stringify(db));

        res.status(200).json({
            ok: true,
            message: "Updated",
            order
        })
    }

    static async  CourseDELETE(req, res) {
        let dbPath = path.join(__dirname, "..", "Database", "db.json");
        let db = await fs.readFile(dbPath, "utf-8");
        db = await JSON.parse(db);

        let slug = slugify(req.params.slug, { remove: /[*+~.()'"!:@]/g, lower: true})

        let order = db.orders.find(el => el.slug === slug)
        
        if(!order) {
            res.status(400).json({
                ok: false,
                message: "Invalid order"
            })
            return 
        }

        let orderIndex = db.orders.findIndex(el => el.slug === order.slug);

        db.orders.splice(orderIndex, 1)

        await fs.writeFile(dbPath, JSON.stringify(db));

        res.status(200).json({
            ok: true,
            message: "Deleted",
            orders: db.orders
        })
    }


}
