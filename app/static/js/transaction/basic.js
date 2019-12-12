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
                trans_id : null,
                errors: {}
            },
            finished_product_category: "",
            files: [],
            showUploads: false,
            imageUrlArray: [],
            itemToDelete: '',
            imageData: "",
            viewBig: false,
            loader: false,
            data_product_category: [],

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

        try {

            let saved = JSON.parse(localStorage.getItem('basic'))

            if (saved.length != 0) {

                if (saved[0] != null) {
                    this.form = saved[0]
                }
                if (saved[2] != null) {

                    this.files = saved[1]
                    this.imageUrlArray = saved[2]
                }

            }
            
        }
        catch (error) {
            console.log("Error in getting data from localStorage.")
        }

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
    },
    methods: {

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


        getProductCategory(option) {
            if (option != null) {
                this.form.finished_product_category = option.id
            }
            else {
                this.form.finished_product_category = null
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

                            this.loader = false
                        }
                        catch (error) {
                            this.loader = false
                            console.log('Unable to save data - ' + String(error))
                        }
                    })
                    .catch(function (error) {
                        this.loader = false
                        console.log('Unable to save data - ' + String(error))
                    })

            }


        }


    }
})