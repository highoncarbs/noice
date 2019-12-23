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
                images: null,
                trans_id: null,
                errors: {}
            },
            finished_product_category: "",
            team_leader: "",
            files: [],
            showUploads: false,
            imageUrlArray: [],
            itemToDelete: '',
            imageData: "",
            viewBig: false,
            loader: false,
            data_product_category: [],
            data_team_leader: [],
            fileNameList: [],
            ogData: {},
            ogFiles: [],


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
    mounted() {
        let self = this
        this.form.start_date = moment().format('YYYY-MM-DD')
        axios.get('/transaction/get/last')
            .then(function (response) {
                self.form.trans_id = response.data.new_id
            })



        let raw = this
        axios.get('/basic_master/get/product_category')
            .then(function (response) {
                raw.data_product_category = response.data
                self.setProductCategory(self.form['finished_product_category'])

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
        axios.get('/basic_master/get/leader')
            .then(function (response) {
                raw.data_team_leader = response.data
                self.setTeamLeader(self.form['team_leader'])

            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Team Leader',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })

        // Loads locally saved data 
        try {

            let saved = JSON.parse(localStorage.getItem('basic'))

            if (saved.length != 0) {

                if (saved[0] != null) {
                    this.form = saved[0]

                    let upload_folder = saved[2]
                    axios.post('/transaction/get/basic/files/folder', upload_folder)
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


            }

        }
        catch (error) {
            console.log("Error in getting data from localStorage.")
        }
    },
    computed: {

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
        autocompleteTeamLeader() {

            if (this.data_team_leader.length != 0) {
                return this.data_team_leader.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.team_leader) >= 0
                })
            }
        },
    },
    methods: {
        getProductCategory(option) {
            if (option != null) {
                this.form.finished_product_category = option.id
                this.ogData.finished_product_category = option.id
                this.finished_product_category = option.name
            }
            else {
                this.form.finished_product_category = null
            }
        },

        getTeamLeader(option) {
            if (option != null) {
                this.form.team_leader = option.id
                this.ogData.team_leader = option.id
                this.team_leader = option.name
            }
            else {
                this.form.team_leader = null
            }
        },
        setTeamLeader(id) {
            if (id != null) {
                let selected = this.data_team_leader.filter(item => { return item.id === id })
                this.form.team_leader = selected[0].id
                this.team_leader = selected[0].name
            }
            else {
                this.form.team_leader = null
            }
        },
        setProductCategory(id) {
            let self = this
            if (id) {

                let selected = this.data_product_category.filter((item) => { return item.id === id })
                this.form.finished_product_category = selected[0].id
                this.finished_product_category = selected[0].name
            }
            else {
                this.form.finished_product_category = null
            }
        },
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
        showAddData(val) {
            let self = this
            this.$buefy.dialog.prompt({
                message: `<b>Add Data</b> `,
                inputAttrs: {
                    placeholder: 'e.g. Data',
                    maxlength: 100,
                    value: this.name
                },
                confirmText: 'Add',
                onConfirm: (value) => {

                    let formdata = { 'name': value }
                    axios
                        .post('/basic_master/add/' + String(val), formdata)
                        .then(function (response) {
                            console.log(response.data)
                            if (response.data.success) {
                                switch (val) {
                                    case 'product_category':
                                        self.data_product_category.push(response.data.data)
                                        break;
                                    case 'fabric_combination':
                                        self.data_fabric_combination.push(response.data.data)
                                        break;
                                    case 'print_technique':
                                        self.data_print_technique.push(response.data.data)
                                        break;
                                    case 'design_number':
                                        self.data_design_number.push(response.data.data)
                                        break;
                                    case 'uom':
                                        self.data_uom.push(response.data.data)
                                        break;
                                    case 'size_master':
                                        self.data_size.push(response.data.data)
                                        break;
                                    case 'leader':
                                        self.data_team_leader.push(response.data.data)
                                        break;

                                    default:
                                        break;
                                }
                                self.$buefy.snackbar.open({
                                    duration: 4000,
                                    message: response.data.success,
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
                                if (response.data.message) {
                                    self.$buefy.snackbar.open({
                                        duration: 4000,
                                        message: response.data.message,
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


                        })
                        .catch(function (error) {
                            console.log(error)
                        })

                }
            })
        },
        checkData() {
            this.form.errors = {}
            if (this.form.start_date && this.form.finished_product_category && this.form.desc && this.form.team_leader && this.form.days && this.form.target_date) {
                return true
            }
            if (!this.form.start_date) {
                this.$set(this.form.errors, 'start_date', true)
            }
            if (!this.form.finished_product_category) {
                this.$set(this.form.errors, 'finished_product_category', true)
            }
            if (!this.form.desc) {
                this.$set(this.form.errors, 'desc', true)
            }
            if (!this.form.team_leader) {
                this.$set(this.form.errors, 'team_leader', true)
            }
            if (!this.form.days) {
                this.$set(this.form.errors, 'days', true)
            }
            if (!this.form.target_date) {
                this.$set(this.form.errors, 'target_date', true)
            }

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
            this.files = []

        },
        getDate() {
            if (this.form.days != undefined) {
                let momDate = moment(this.form.start_date, 'YYYY-MM-DD')
                this.form.target_date = momDate.add(Number(this.form.days), 'days').format("YYYY-MM-DD")
            }


        },
        next() {

            if (this.checkData()) {
                this.loader = true
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.form))
                if (this.files.length != 0) {
                    for (var i = 0; i < this.files.length; i++) {
                        let file = this.files[i];

                        formData.append('files[' + i + ']', file);
                    }
                }
                else {
                    formData.append('files', null);

                }

                let self = this
                axios.post('/transaction/add/basic', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(function (response) {

                        try {

                            if (response.data.success) {
                                let selectedData = []


                                var basic_id = { 'basic_id': response.data.basic_id }
                                var upload_folder = { 'upload_folder': response.data.upload_folder }
                                selectedData.push(self.form)

                                selectedData.push(basic_id)
                                selectedData.push(upload_folder)

                                localStorage.setItem('basic', JSON.stringify(selectedData))
                                self.$router.push('/activity')

                            }

                            self.loader = false
                        }
                        catch (error) {
                            self.loader = false
                            console.log('Unable to save data - ' + String(error))
                        }
                    })
                    .catch(function (error) {
                        self.loader = false
                        console.log('Unable to save data - ' + String(error))
                    })

            }


        }


    }
})