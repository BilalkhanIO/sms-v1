// src/components/ErrorBoundary.jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-500">
          Something went wrong. Please try again later.
        </div>
      )
    }
    return this.props.children
  }
}

// Wrap components with ErrorBoundary where needed