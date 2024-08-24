import express from 'express';
import methodOverride from 'method-override';
import ejs from 'ejs';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/create', (req, res) => {
    const { title, content } = req.body;
   
    if (!title || !content) {
        return res.status(400).send('Title and content are required!');
    }

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        createdAt: new Date()
    };

    posts.push(newPost);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find(post => post.id === parseInt(id));

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('edit', { post });
});

app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = posts.find(post => post.id === parseInt(id));

    if (!post) {
        return res.status(404).send('Post not found');
    }

    post.title = title;
    post.content = content;
    res.redirect('/');
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex(post => post.id === parseInt(id));

    if (index === -1) {
        return res.status(404).send('Post not found');
    }

    posts.splice(index, 1);
    res.redirect('/');
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
