# Alpine AJAX - Condensed Reference

## Installation

**CDN:**

```html
<script defer src="https://cdn.jsdelivr.net/npm/@imacrayon/alpine-ajax@{VERSION}/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@{VERSION}/dist/cdn.min.js"></script>
```

```javascript
import Alpine from 'alpinejs';
import ajax from '@imacrayon/alpine-ajax';

Alpine.plugin(ajax);
window.Alpine = Alpine;
Alpine.start();
```

## Core Directives

### x-target

Updates specific elements with AJAX responses.

```html
<!-- Single target -->
<form x-target="comments" method="post" action="/comment">
	<button>Submit</button>
</form>

<!-- Multiple targets -->
<form x-target="comments comments_count" method="post">
	<!-- Self-target (blank) -->
	<form x-target id="star_repo" method="post">
		<!-- Target alias -->
		<form x-target="modal_body:page_body">
			<!-- Dynamic targeting -->
			<form x-target:dynamic="'comment_'+comment.id">
				<!-- Conditional by status -->
				<form x-target="login" x-target.away="_top">
					<form x-target="todo_list add_todo_form" x-target.back="add_todo_form">
						<!-- Disable autofocus -->
						<a x-target.nofocus="dialog_content">
							<!-- Disable AJAX for specific button -->
							<button formnoajax name="action" value="purchase"></button
						></a>
					</form>
				</form>
			</form>
		</form>
	</form>
</form>
```

### x-merge

Controls how new content merges with existing content.

```html
<!-- Append new items -->
<ul id="messages" x-merge="append">
	<!-- Prepend new items -->
	<ul id="notifications" x-merge="prepend">
		<!-- Morph (requires @alpinejs/morph plugin) -->
		<div id="contacts" x-merge="morph">
			<!-- Transition effects -->
			<form x-merge.transition></form>
		</div>
	</ul>
</ul>
```

**Install Morph Plugin:**

```bash
npm i @alpinejs/morph
```

```javascript
import morph from '@alpinejs/morph';
Alpine.plugin(morph);
```

### x-sync

Auto-updates elements when server sends matching IDs.

```html
<ul x-sync id="notifications"></ul>
```

### x-headers

Add custom request headers.

```html
<form x-headers="{'Custom-Header': 'value'}" x-target="result"></form>
```

### x-autofocus

Auto-focuses elements after AJAX updates.

```html
<input name="email" x-autofocus /> <a href="/edit" x-target="form" x-autofocus>Edit</a>
```

## $ajax Magic Helper

```javascript
// Basic usage
$ajax('/endpoint');

// With options
$ajax('/validate', {
	method: 'post',
	body: { email },
	target: 'email_field',
});
```

## Events

```javascript
// Available events
@ajax:before    // Before request
@ajax:success   // After success
@ajax:error     // After error
@ajax:complete  // After any completion

// Abort request
@ajax:before="confirm('Sure?') || $event.preventDefault()"
```

## Configuration

```javascript
Alpine.plugin(
	ajax.configure({
		headers: { 'X-CSRF-Token': 'token' },
		mergeStrategy: 'morph',
	})
);
```

## Common Patterns

### Instant Search

```html
<form x-target="contacts" action="/contacts">
	<input type="search" name="search" @input.debounce="$el.form.requestSubmit()" />
</form>
<tbody id="contacts">
	...
</tbody>
```

### Inline Validation

```html
<div x-data="{email: ''}" @change="$ajax('/validate', {method: 'post', body: {email}})">
	<input x-model="email" />
</div>
```

### Infinite Scroll

```html
<tbody id="records" x-merge="append">
	...
</tbody>
<div x-intersect="$ajax('/contacts?page=2', {target: 'records pagination'})"></div>
```

### Delete with Confirmation

```html
<tbody x-init @ajax:before="confirm('Sure?') || $event.preventDefault()">
	<form method="delete" x-target="contacts">
		<button>Delete</button>
	</form>
</tbody>
```

### Progress Bar

```html
<div id="job" x-init="setTimeout(() => $ajax('/jobs/1'), 600)">
	<div role="progressbar" aria-valuenow="25">...</div>
</div>
```

### Notifications

```html
<ul x-sync id="notifications" x-merge="prepend" role="status">
	<li
		x-data="{show: false, init() { 
    this.$nextTick(() => this.show = true)
    setTimeout(() => this.dismiss(), 6000)
  }}"
		x-show="show"
		x-transition
	>
		<span>Message</span>
		<button @click="dismiss">×</button>
	</li>
</ul>
```

### Dialog

```html
<ul x-init @ajax:before="$dispatch('dialog:open')">
	<li><a href="/contacts/1" x-target="contact">View</a></li>
</ul>
<dialog x-init @dialog:open.window="$el.showModal()">
	<div id="contact"></div>
</dialog>
```

## Default Request Headers

```
X-Alpine-Request: true
X-Alpine-Target: {target_ids}
```
