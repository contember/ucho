import { SchemaNames } from '@contember/client-content'
export const ContemberClientNames: SchemaNames = {
  "entities": {
    "Comment": {
      "name": "Comment",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "content": {
          "type": "column"
        },
        "date": {
          "type": "column"
        },
        "feedbackItem": {
          "type": "one",
          "entity": "FeedbackItem"
        },
        "user": {
          "type": "one",
          "entity": "User"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "content",
        "date"
      ]
    },
    "FeedbackItem": {
      "name": "FeedbackItem",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "title": {
          "type": "column"
        },
        "description": {
          "type": "column"
        },
        "attachments": {
          "type": "column"
        },
        "status": {
          "type": "column"
        },
        "priority": {
          "type": "column"
        },
        "date": {
          "type": "column"
        },
        "project": {
          "type": "one",
          "entity": "Project"
        },
        "group": {
          "type": "one",
          "entity": "Grouping"
        },
        "reporter": {
          "type": "one",
          "entity": "User"
        },
        "comments": {
          "type": "many",
          "entity": "Comment"
        },
        "tags": {
          "type": "many",
          "entity": "Tag"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "title",
        "description",
        "attachments",
        "status",
        "priority",
        "date"
      ]
    },
    "Grouping": {
      "name": "Grouping",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "feedbackItems": {
          "type": "many",
          "entity": "FeedbackItem"
        },
        "name": {
          "type": "column"
        },
        "description": {
          "type": "column"
        },
        "project": {
          "type": "one",
          "entity": "Project"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "name",
        "description"
      ]
    },
    "Person": {
      "name": "Person",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "personId": {
          "type": "column"
        },
        "updatedAt": {
          "type": "column"
        },
        "tenantPerson": {
          "type": "one",
          "entity": "TenantPerson"
        },
        "userPerson": {
          "type": "one",
          "entity": "User"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "personId",
        "updatedAt"
      ]
    },
    "Project": {
      "name": "Project",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "name": {
          "type": "column"
        },
        "description": {
          "type": "column"
        },
        "feedbackItems": {
          "type": "many",
          "entity": "FeedbackItem"
        },
        "groupings": {
          "type": "many",
          "entity": "Grouping"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "name",
        "description"
      ]
    },
    "Tag": {
      "name": "Tag",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "name": {
          "type": "column"
        },
        "color": {
          "type": "column"
        },
        "feedbackItems": {
          "type": "many",
          "entity": "FeedbackItem"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "name",
        "color"
      ]
    },
    "TenantPerson": {
      "name": "TenantPerson",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "identityId": {
          "type": "column"
        },
        "email": {
          "type": "column"
        },
        "name": {
          "type": "column"
        },
        "otpUri": {
          "type": "column"
        },
        "otpActivatedAt": {
          "type": "column"
        },
        "idpOnly": {
          "type": "column"
        },
        "roles": {
          "type": "column"
        },
        "person": {
          "type": "one",
          "entity": "Person"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "identityId",
        "email",
        "name",
        "otpUri",
        "otpActivatedAt",
        "idpOnly",
        "roles"
      ]
    },
    "User": {
      "name": "User",
      "fields": {
        "id": {
          "type": "column"
        },
        "createdAt": {
          "type": "column"
        },
        "reportedFeedback": {
          "type": "many",
          "entity": "FeedbackItem"
        },
        "name": {
          "type": "column"
        },
        "email": {
          "type": "column"
        },
        "comments": {
          "type": "many",
          "entity": "Comment"
        },
        "person": {
          "type": "one",
          "entity": "Person"
        }
      },
      "scalars": [
        "id",
        "createdAt",
        "name",
        "email"
      ]
    }
  },
  "enums": {
    "feedbackStatus": [
      "open",
      "inProgress",
      "resolved"
    ],
    "priority": [
      "low",
      "medium",
      "high"
    ]
  }
}