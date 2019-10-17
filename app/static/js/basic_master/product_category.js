const ProductCategoryForm =
{
    template: "#product_category_form",
    data() {
        return {
            view: true,
            form: {
                errors: [],
                id: null,
                name: null,
                desc: null,
                image: null,
            },
            data: null,
            modal: false,
            edit: {
                errors: [],
                name: null,
                desc: null,
                image: null,
                index: null
            },
            confirm: false,
            fileSrc: null,
            viewUpload: false
        }
    },

    delimiters: ["[[", "]]"],
    mounted() {

        this.$refs.name.focus();
    },
    methods: {
        checkData(e) {
            this.form.errors = []

            if (this.form.name) {
                return true;
            }
            if (!this.form.name) {
                this.form.errors.push('Product Category required');
            }


        },

        submitData(e) {

            var formdata = this;

            if (this.checkData()) {
                let formData = new FormData()
                let stringData = { 'name': this.form.name, 'desc': this.form.desc }
                formData.append('data', JSON.stringify(stringData))
                formData.append('image', this.form.image)
                axios
                    .post('/basic_master/add/product_category', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {

                        if (response.data.success) {
                            formdata.form.name = null;
                            formdata.form.desc = null;
                            formdata.form.image = null;

                            formdata.$buefy.snackbar.open({
                                duration: 40000,
                                message: response.data.success,
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })

                            formdata.$refs.imageUpload.removeImage();
                        }
                        else {
                            if (response.data.message) {
                                formdata.$buefy.snackbar.open({
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
            const formdata = this;

            axios
                .get('/basic_master/get/product_category')
                .then(function (response) {
                    console.log(response);
                    formdata.data = response['data']

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
            this.edit.id = data.id
            this.edit.index = index
            this.edit.image = data.image
            this.edit.desc = data.desc
            this.$refs.editname.focus();

        },
        saveEditData(e) {
            const formdata = this;
            let dataList = this.data;
            if (this.edit.name) {
                let formData = new FormData()
                let stringData = { 'id': this.edit.id, 'name': this.edit.name, 'desc': this.edit.desc }
                formData.append('data', JSON.stringify(stringData))
                formData.append('image', this.edit.image)

                axios
                    .post('/basic_master/edit/product_category', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        console.log(response.data.success)

                        if (response.data.success) {
                            dataList = formdata.data.filter(function (x) { return x.id === formdata.edit.id })
                            dataList[0].name = formdata.edit.name
                            formdata.modal = !formdata.modal;

                            formdata.$buefy.snackbar.open({
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
                                formdata.$buefy.snackbar.open({
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
                return true;
            }


            this.edit.errors = []
            console.log(this.edit.name)

            if (this.edit.name == "") {
                this.edit.errors.push('Location required');

            }

            e.preventDefault();

        },
        deleteData(data, index) {

            let dataList = this.data;
            let formdata = this
            axios
                .post('/basic_master/delete/product_category', data)
                .then(function (response) {
                    if (response.data.success) {
                        dataList.splice(index, 1)
                        formdata.$buefy.snackbar.open({
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
                        formdata.$buefy.snackbar.open({
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
            this.edit.image = null
        }

    }
}

