const Note = require("../models/note.model.js");
//every route has its own request handler here complete with request validation and error handling
exports.create = (req, res)=> {
    if(!req.body.content){
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
    
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });

    note.save()
    .then(data=> {
        res.sendStatus(200);   // res code 200, note created. return code 200 added to all succesfull opperations
        res.send(data);
    }).catch(err=> {
        res.status(500).send({
            message: err.message || "Some error occured while creating note"
        });
    });
};

exports.findAll = (req, res)=> {
    Note.find()
    .then(notes=> {
        res.sendStatus(200);
        res.send(notes);
    }).catch(err=> {
        res.status(500).send({
            message: err.message || "Some error ocurred while fetching notes"
        });
    });
};

exports.findOne = async (req, res)=> {               // database scan is run async
    Note.findById(req.params.noteId)
    .then(note=> {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.sendStatus(200);
        res.send(note);
        await;
    }).catch(err=> {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

exports.update = (req, res)=> {
    if(!req.body.content){
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    },{new: true})                                 //this line is used to return the modified version of the document to the then() function
    .then(note=> {
        if(!note) {
        return res.status(404).send({
            message: "Note not found with id " + req.params.noteId
        });
    }
    res.sendStatus(200);
    res.send(note);
    }).catch(err=> {
        if(err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Error updating note with id" + req.params.noteId
        });
    });
};

exports.delete = (req, res)=> {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note=> {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.sendStatus(200);
        res.send({message: "Note deleted succesfully!"});
    }).cathc(err=> {
        if(err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};

// fonksiyonlar??n (req, res, next) parametrelerini inceledim. Next fonksiyonunun ne oldu??unu ve nerelerde kullan??labilece??ini anlad??????m?? d??????n??yorum
// bunun hakk??nda ??rnekler inceledim ve okuma yapt??m, ancak bu kodda nerede nas??l bulundurman??n faydal?? olaca????n?? anlayamad??m.
// kodum daha mod??ler olsayd?? ve daha fazla helper function tan??mlam???? olsayd??m etkili ??ekilde kullanabilirdim.
// error handling i??in bir helper function tan??mplay??p, ayn?? uri ??zerinde ard??????k olarak bu fonksiyonlar?? next parametresi ile ba??larsam
// i??e yarar m??? Bu kod i??in akl??ma sadece bu geliyor. Okudu??um kadar??yla ??ok g??zel bir kullan??m alan?? admin yetkilerini y??netmek.

// function requireAdmin(req, res, next) {
//     if (!req.user || !req.user.admin) {
//       next(new Error("Permission denied."));
//       return;
//     }
//   
//     next();
//   }
//   
//   app.get('/top/secret', loadUser, requireAdmin, function(req, res) {
//     res.send('blahblahblah');
//   });

// buradaki gibi


// asenkron i??lem y??r??tme ve promise verip i??lem beklememe gibi olaylar?? anlad??m. await mod??l??n??n de i??levini anlad??????m?? d??????n??yorum ama burda da
// next parametresi gibi nereye ekleyece??imi bilemedim. ????nk?? kod ??ok lineer g??z??k??yor. E?? zamanl?? olarak y??r??tmesi gereken i??lemler, veya
// performans anlam??nda bottleneck ya??anacak bi yer g??rm??yorum. Bundan dolay?? async i??lem y??r??tmenin nas??l bi faydas?? olaca????n?? anlamad??m.
// Akl??ma gelen en iyi kullan??m alan?? database taramas?? yaparken kullanmak oldu (kullan??lan tarama algoritmas??na g??re zaman hassasiyeti
// y??ksek olabilir. Burda i??lemin sonucunu beklemek yerine async verip d??necek sonucu promise etmek mant??kl?? olur.) bu y??zden
// findOne fonksiyonu i??inde await mod??l?? ile birlikte kulland??m. (line 38)
