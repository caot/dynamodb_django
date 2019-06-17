export LOCAL="--endpoint-url http://localhost:8000"

aws dynamodb create-table \
    $LOCAL \
    --table-name Person \
    --attribute-definitions \
        AttributeName=person_id,AttributeType=S \
    --key-schema \
        AttributeName=person_id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb put-item \
--table-name Person $LOCAL \
--item \
    '{"person_id": {"S": "1001"}, "location": {"S": "Seattle, WA"}, "first_name": {"S": "Jef"}, "last_name": {"S": "Bez"}, "net_worth": {"N": "66"}, "source_of_wealth": {"S": "Amz"}}'

aws dynamodb put-item \
--table-name Person $LOCAL \
--item \
    '{"person_id": {"S": "1002"}, "location": {"S": "Omaha, NE"}, "first_name": {"S": "Wallen"}, "last_name": {"S": "Buf"}, "net_worth": {"N": "72"}, "source_of_wealth": {"S": "Berk"}}'

aws dynamodb put-item \
--table-name Person $LOCAL \
--item \
    '{"person_id": {"S": "1003"}, "location": {"S": "NYC, NY"}, "first_name": {"S": "Jack"}, "last_name": {"S": "Smith"}, "net_worth": {"N": "60"}, "source_of_wealth": {"S": "Unkown"}}'
