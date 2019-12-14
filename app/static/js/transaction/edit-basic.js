const BasicForm = ({
    template: '#basic_form',
    data() {
        return {
            pp_num: null,
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
            finished_product_category: "",
            images: [],
            files: [],
            showUploads: false,
            imageUrlArray: [],
            itemToDelete: '',
            imageData: "",
            viewUpload: false,
            loader: false,
            fileSrc: null,
            data_product_category: [],
            fileNameList: [],
            ogData: {},
            ogFiles: []
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
        autocompleteProductCategory() {

            if (this.data_product_category.length != 0) {
                return this.data_product_category.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.finished_product_category) >= 0
                })
            }
        },
    },
    mounted() {
        let raw = this
        axios.get('/basic_master/get/product_category')
            .then(function (response) {
                raw.data_product_category = response.data

            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Product Category',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })

        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]
            this.pp_num = pp_num
            let self = this
            axios.get('/transaction/get/basic/' + String(pp_num))
                .then(function (response) {
                    if (response.data) {
                        self.form = JSON.parse(response.data)[0]
                        self.$set(self.form, 'transaction_id', self.pp_num)
                        self.ogData = JSON.parse(response.data)[0]
                        // self.form.finished_product_category = null
                        self.getProductCategory(self.form['finished_product_category'][0])
                        // console.log(response.data['finished_product_category'])

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

                        self.images.forEach(function (item) {
                            let tempURL = self.getStatic(item)
                            self.createFileObject(String(tempURL))

                            // inject an image with the src url


                            // when the file is read it triggers the onload 
                            // event above.
                        })


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
        async createFileObject(filedata) {
            this.loader = true;

            let filename = String(filedata).split("\\");
            let response = await fetch(String(filedata));
            let data = await response.blob();
            let metadata = {
                type: 'image/jpeg'
            };

            this.fileNameList.push(filename[filename.length - 1])
            this.ogFiles.push(filename[filename.length - 1])

            // generate a new FileReader object
            var reader = new FileReader()
            let file = new File([data], filename[filename.length - 1], metadata);
            this.files.push(file)
            let self = this;
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                // const thumb = document.querySelectorAll('.thumb')[index];
                self.imageUrlArray.push(imageUrl);
            }

            // when the file is read it triggers the onload 
            // event above.
            reader.readAsDataURL(file);
            this.loader = false;
        },
        getStatic(filedata) {
            if (filedata) {
                let fileSrc = String('\\static') + String(filedata).split('\static')[1]
                return fileSrc
            }
            else {
                return null
            }
        },
        getProductCategory(option) {
            console.log(option)
            if (option != null) {
                this.form.finished_product_category = option.id
                this.ogData.finished_product_category = option.id
                this.finished_product_category = option.name
            }
            else {
                this.form.finished_product_category = null
            }
        },
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
                if (!self.fileNameList.includes(files[index].name)) {


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

                    console.log(reader)
                }
                else {

                    self.$buefy.snackbar.open({
                        duration: 5000,
                        message: 'File already uploaded. Try changing filename',
                        type: 'is-light',
                        position: 'is-top-right',
                        actionText: 'Close',
                        queue: true,
                        onAction: () => {
                            this.isActive = false;
                        }
                    })
                }
            }
        },
        deleteItem: function (index) {

            this.files.splice(index, 1)
            this.imageUrlArray.splice(index, 1)


        },
        clearUploads() {
            this.imageUrlArray = []
            this.files = []

        },

        next() {




            let formData = new FormData()
            formData.append('data', JSON.stringify(this.form))
            for (var i = 0; i < this.files.length; i++) {
                let file = this.files[i];

                formData.append('files[' + i + ']', file);
            }

            let self = this
            axios.post('/transaction/update/basic/' + String(this.pp_num), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {

                    try {

                        if (response.data.success) {
                            if (response.data.success) {
                                self.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: "Data updated",
                                    type: 'is-light',
                                    position: 'is-top-right',
                                    actionText: 'Close',
                                    queue: true,
                                    onAction: () => {
                                        this.isActive = false;
                                    }
                                })
                            }
                            else {
                                self.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: "Something went wrong",
                                    type: 'is-light',
                                    position: 'is-top-right',
                                    actionText: 'Close',
                                    queue: true,
                                    onAction: () => {
                                        this.isActive = false;
                                    }
                                })
                            }

                        }
                    }
                    catch (error) {
                        console.log('Unable to save data - ' + String(error))
                    }
                })
                .catch(function (error) {
                    console.log('Unable to save data - ' + String(error))
                })


        }
    }
})