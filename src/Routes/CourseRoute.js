const { CoursesGET,–°oursePOST , CourseGET, CoursePATCH, CourseDELETE } = require("../Controllers/CourseController");


const router = require("express").Router();

router.get("/buy", CoursesGET),
router.post("/buy", –°oursePOST),
router.get("/buy/:slug",  CourseGET),
router.patch("/buy/:slug",  CoursePATCH),
router.delete("/buy/:slug",  CourseDELETE)

module.exports = {
    path: "/api",
    router
}