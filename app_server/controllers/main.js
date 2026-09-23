/* GET home page */
const index = function(req, res){ 
    res.render('index', { title: 'Cakes By Isabelle' }); 
};

module.exports = { 
    index 
};
