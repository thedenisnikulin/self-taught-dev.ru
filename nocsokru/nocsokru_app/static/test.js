class App {
    constructor() {
        this.root = null;
    }

    initStatic(statics) {
        this.statics = statics
    }

    setRoot(rootComponent) {
    this.root = rootComponent
    }

    mount() {
        $('.root').html(this.root.render())
    }
}


class Hiring {
    constructor(app) {
        this.state = {
            job: {
                name: '',
                employer: '',
                employer_logo: '',
                tags: {
                    tech: [],
                    type: [],
                    city: '',
                },
                url: '',
                date: '',
                color: '#F5BA78'
            },
            jobLink: ''
        }   
        this.app = app
    }

    update(newState) {
        this.state = newState;
        this.app.mount()
    }

    render() {
        if (this.state.b) {
        return `${this.state.name}`
        } else {
        return `${sub.state.name}`
        }
    }
}

  
const app = new App()
const hiring = new Hiring(app)
const sub = new Sub(app)
app.setRoot(hiring)
app.mount()
hiring.update({name: 'brand new', b: true})
