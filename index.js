if (window != window.top) {
    document.body.classList.add('inline');
}

panel.plugin('hananils/modules-inline', {
    components: {
        'k-item': {
            extends: 'k-item',
            template: `<article
    :class="classnames"
    v-bind="data"
    :data-has-figure="hasFigure"
    :data-has-flag="Boolean(flag)"
    :data-has-info="Boolean(info)"
    :data-has-options="Boolean(options)"
    tabindex="-1"
    @click="$emit('click', $event)"
    @dragstart="$emit('drag', $event)"
    ref="item"
>
    <!-- Image -->
    <slot name="image">
        <k-item-image
            v-if="hasFigure"
            :image="image"
            :layout="layout"
            :width="width"
        />
    </slot>

    <!-- Sort handle -->
    <k-sort-handle v-if="sortable" class="k-item-sort-handle" />

    <!-- Content -->
    <header
        class="k-item-content"
    >
        <slot>
            <h3 class="k-item-title">
                <k-button
                    v-if="layout === 'module'"
                    icon="angle-right"
                    class="k-module-button"
                    @click="onToggle"
                >
                    <span v-html="title" />
                </k-button>
                <k-link
                    v-else-if="link !== false && layout !== 'module'"
                    :target="target"
                    :to="link"
                    class="k-item-title-link"
                >
                    <span v-html="title" />
                </k-link>
                <span v-else v-html="title" />
            </h3>
            <p v-if="info" class="k-item-info" v-html="info" />
        </slot>
    </header>

    <!-- Footer -->
    <footer v-if="flag || options || $slots.options" class="k-item-footer">
        <nav class="k-item-buttons" @click.stop>
            <!-- Status icon -->
            <k-status-icon v-if="flag" v-bind="flag" />

            <!-- Options -->
            <slot name="options">
                <k-options-dropdown
                    v-if="options"
                    :options="options"
                    class="k-item-options-dropdown"
                    @option="onOption"
                />
            </slot>
        </nav>
    </footer>

	<div
        v-if="layout === 'module'"
        class="k-modules-preview is-loading"
        ref="preview"
    >
         <iframe
            v-if="loading === true"
            v-once
            :src="this.$url(link)"
            @load="onLoad"
            @beforeunload="onUnload"
        >
        </iframe>
    </div>
</article>`,
            props: {
                loading: {
                    type: Boolean,
                    default: false
                },
                open: {
                    type: Boolean,
                    default: false
                }
            },
            computed: {
                classnames() {
                    let classnames = ['k-item'];

                    if (this.layout) {
                        classnames.push('k-' + this.layout + '-item');

                        if (this.layout === 'module' && this.changes === true) {
                            classnames.push('has-changes');
                        }

                        if (this.open === true) {
                            classnames.push('is-open');
                        }
                    }

                    return classnames.join(' ');
                }
            },
            created() {
                const key = 'kirby$content$' + this.link;
                const storage = window.localStorage.getItem(key);
                let data = {};

                if (storage) {
                    data = JSON.parse(storage);
                    this.checkChanges(data);
                }

                window.addEventListener('storage', (event) => {
                    if (event.key === key) {
                        data = JSON.parse(event.newValue);
                        this.checkChanges(data);
                    }
                });
            },
            watch: {
                $props() {
                    this.$forceUpdate();
                }
            },
            methods: {
                onToggle: function () {
                    this.loading = true;
                    this.open = !this.open;
                },
                onLoad: function ({ target }) {
                    this.resizeObserver = new ResizeObserver(([entry]) => {
                        if (this.$refs.preview) {
                            this.$refs.preview.classList.remove('is-loading');
                        }

                        target.style.height =
                            entry.contentBoxSize[0].blockSize + 'px';
                    });

                    // Adjust iframe to content size
                    this.resizeObserver.observe(target.contentDocument.body);
                },
                onUnload: function ({ target }) {
                    this.resizeObserver.unobserve(target.contentDocument.body);
                },
                checkChanges: function (data) {
                    if (data && 'changes' in data) {
                        this.changes = Object.keys(data.changes).length
                            ? true
                            : false;
                    }
                }
            }
        }
    }
});
