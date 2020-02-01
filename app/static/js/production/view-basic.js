const BasicForm = ({
    template: '#basic_form',
    data() {
        return {
            form: {
                start_date: null,
                finished_product_category: null,
                desc: null,
                team_leader: null,
                team_members: null,
                days: null,
                target_date: null,
                images: null
            },
            images: [],
            files: [],
            showUploads: false,
            imageUrlArray: [],
            itemToDelete: '',
            imageData: "",
            viewUpload: false,
            loader: false,
            fileSrc: null,
            pp_num: null
        }

    },
    delimiters: ['[[', ']]'],
    filters: {
        getIndexedImage(val, index) {
            // console.log(`This: ${val}`);
            return val[index];
        },

        formatBytes(a, b) {
            if (0 == a) return "0 Bytes";
            var c = 1024,
                d = b || 2,
                e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
                f = Math.floor(Math.log(a) / Math.log(c));
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
        }
    },
    computed: {
        getDate() {
            if (this.form.days != undefined) {
                let momDate = moment(this.form.start_date, 'YYYY-MM-DD')
                this.form.target_date = momDate.add(Number(this.form.days), 'days').format("YYYY-MM-DD")
            }


        },
    },
    mounted() {

        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]
            this.pp_num = pp_num
            let self = this
            axios.get('/transaction/get/basic/' + String(pp_num))
                .then(function (response) {
                    if (response.data) {
                        self.form = JSON.parse(response.data)[0]
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    self.$buefy.snackbar.open({
                        duration: 4000,
                        message: "Unable to load data",
                        type: 'is-light',
                        position: 'is-top-right',
                        actionText: 'Close',
                        queue: true,
                        onAction: () => {
                            this.isActive = false;
                        }
                    })


                })
            axios.get('/transaction/get/basic/files/' + String(pp_num))
                .then(function (response) {
                    console.log(response)
                    if (response.data) {
                        self.images = response.data
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    self.$buefy.snackbar.open({
                        duration: 4000,
                        message: "Unable to load files",
                        type: 'is-light',
                        position: 'is-top-right',
                        actionText: 'Close',
                        queue: true,
                        onAction: () => {
                            this.isActive = false;
                        }
                    })


                })

        }
        catch (error) {
            console.log("Unable to load data from Endpoint" + String(error))
        }

    },
    methods: {
        getStatic(filedata) {
            if (filedata) {
                let fileSrc = String('\\static') + String(filedata).split('\static')[1]
                return fileSrc
            }
            else {
                return null
            }
        },

        setUpload(row) {
            this.viewUpload = true
            this.fileSrc = row;
        },
        listUploads(e) {
            this.showUploads = true;
            let files = e.srcElement.files;


            let self = this;

            for (var index = 0; index < files.length; index++) {
                // generate a new FileReader object
                var reader = new FileReader();
                self.files.push(files[index])
                // inject an image with the src url
                reader.onload = function (event) {
                    const imageUrl = event.target.result;
                    // const thumb = document.querySelectorAll('.thumb')[index];
                    self.imageUrlArray.push(imageUrl);
                }

                // when the file is read it triggers the onload 
                // event above.
                reader.readAsDataURL(files[index]);
            }
        },
        deleteItem: function (index) {

            this.files.splice(index, 1)
            this.imageUrlArray.splice(index, 1)


        },
        clearUploads() {
            this.imageUrlArray = []

        },

        next() {


            this.$router.push('/view-activity')

        }

    }
})