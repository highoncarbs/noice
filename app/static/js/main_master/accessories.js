new Vue({
    el: '#accessories_master',
    data() {
        return {
            view: true,
            query_uom: '',
            form: {
                errors: [],
                name: null,
                desc: null,
                image: null,
                uom: null,
            },
            data: [],
            modal: false,
            edit: {
                errors: [],
                name: null,
                desc: null,
                image: null,
                index: null,
                uom: null,
            },
            // confirm: false,
            fileSrc: null,
            viewUpload: false,
            data_uom: [],

        }
    },

    delimiters: ["[[", "]]"],
    mounted() {

        this.$refs.name.focus();
  

        let raw = this
        axios.get('/basic_master/get/uom')
            .then(function (response) {
                raw.data_uom = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Uom',
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
        autocompleteUom() {

            if (this.data_uom.length != 0) {
                return this.data_uom.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.query_uom.toLowerCase()) >= 0
                })
            }
        },
    },
    methods: {
        showAddData(val) {
            let self = this
            this.$buefy.dialog.prompt({
                message: `<b>Add Data</b> `,
                inputAttrs: {
                    placeholder: 'e.g. SKD',
                    maxlength: 20,
                    value: this.name
                },
                confirmText: 'Add',
                onConfirm: (value) => {

                    let formdata = { 'name': value }
                    axios
                        .post('/basic_master/add/' + String(val), formdata)
                        .then(function (response) {

                            if (response.data.success) {
                                switch (val) {
                                    case 'uom':
                                        self.data_uom.push(response.data.data)
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
        checkData(e) {
            this.form.errors = []

            if (this.form.name) {
                return true;
            }
            if (!this.form.name) {
                this.form.errors.push('Name required');
            }


        },
        checkEditData(e) {
            this.edit.errors = []

            if (this.edit.name) {
                return true;
            }
            if (!this.edit.name) {
                this.edit.errors.push('Name required');
            }


        },

        submitData(e) {

            var raw = this;

            if (this.checkData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.form))
                formData.append('image', this.form.image)
                axios
                    .post('/main_master/add/accessories', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {

                        if (response.data.success) {
                            raw.form.name = null;
                            raw.form.desc = null;
                            raw.form.image = null;
                            raw.form.uom = null;
                            raw.query_uom = '';

                            raw.$buefy.snackbar.open({
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

                            raw.$refs.imageUpload.removeImage();
                        }
                        else {
                            if (response.data.message) {
                                raw.$buefy.snackbar.open({
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
            e.preventDefault();
        },
        getData(e) {
            const raw = this;

            axios
                .get('/main_master/get/accessories')
                .then(function (response) {
                    console.log(response);
                    raw.data = response['data']

                })
                .catch(function (error) {
                    console.log(error)
                });

            e.preventDefault();
        },
        editData(data, index) {
            this.edit.errors = []

            this.modal = true
            this.edit.name = data.name
            
            this.query_uom = data.uom[0].name
            this.edit.uom = data.uom[0].id
            
            this.edit.id = data.id
            this.edit.index = index
            this.edit.image = data.image
            this.edit.desc = data.desc
            this.$refs.editname.focus();

        },
        saveEditData(e) {
            let raw = this;
            let dataList = this.data;
            if (this.checkEditData()) {
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.edit))
                formData.append('image', this.edit.image)

                axios
                    .post('/main_master/edit/accessories', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        console.log(response.data.success)

                        if (response.data.success) {
                            dataList = raw.data.filter(function (x) { return x.id === raw.edit.id })
                            dataList[0].name = raw.edit.name
                            dataList[0].desc = raw.edit.desc
                            dataList[0].uom[0].name = raw.query_uom
                            dataList[0].uom[0].id = raw.edit.uom
                            raw.modal = !raw.modal;

                            raw.$buefy.snackbar.open({
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
                                raw.$buefy.snackbar.open({
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


        },
        deleteData(data, index) {

            let dataList = this.data;
            let raw = this
            axios
                .post('/main_master/delete/accessories', data)
                .then(function (response) {
                    if (response.data.success) {
                        dataList.splice(index, 1)
                        raw.$buefy.snackbar.open({
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
                        raw.$buefy.snackbar.open({
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
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getStatic(filedata) {
            if (this.data[filedata].image != null) {
                let fileSrc = String('\\static') + String(this.data[filedata].image).split('\static')[1]
                return fileSrc
            }
            else {
                return null
            }
        },
        viewBig(index) {

            this.fileSrc = this.getStatic(index)
            if (this.fileSrc != null) {

                this.viewUpload = !this.viewUpload

            }


        },
        removeImage() {
            this.form.image = null
            this.$refs.imageUpload.removeImage();
            this.$refs.imageUploadSlim.removeImage();

        },
        getLastRow() {
            let raw = this
            axios.get('/main_master/get/accessories/last')
                .then(function (response) {
                    data = response.data


                    raw.form.name = data.name
                    raw.form.desc = data.desc
                    raw.form.uom = data.uom[0].id
                    raw.query_uom = data.uom[0].name
                })
        }

    }
})

