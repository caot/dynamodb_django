export LOCAL="--endpoint-url http://localhost:8000"

aws dynamodb delete-table $LOCAL \
    --table-name Music

aws dynamodb create-table \
    $LOCAL \
    --table-name Music \
    --attribute-definitions \
        AttributeName=Artist,AttributeType=S \
        AttributeName=SongTitle,AttributeType=S \
    --key-schema AttributeName=Artist,KeyType=HASH AttributeName=SongTitle,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

aws dynamodb put-item \
    $LOCAL \
    --table-name Music  \
    --item \
        '{"Artist": {"S": "No One You Know"}, "SongTitle": {"S": "Call Me Today"}, "AlbumTitle": {"S": "Somewhat Famous"}}' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    $LOCAL \
    --table-name Music \
    --item '{"Artist": {"S": "Acme Band"}, "SongTitle": {"S": "Happy Day"}, "AlbumTitle": {"S": "Songs About Life"}}' \
    --return-consumed-capacity TOTAL

aws dynamodb delete-table $LOCAL \
    --table-name Person

aws dynamodb create-table \
    $LOCAL \
    --table-name Person \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=first_name,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
        AttributeName=first_name,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

  aws dynamodb put-item --table-name Person $LOCAL --item \
      '{"id": {"S": "1001"}, "location": {"S": "Seattle, WA"}, "first_name": {"S": "Jeff"}, "last_name": {"S": "Bez"}, "net_worth": {"N": "66"}, "source_of_wealth": {"S": "Amazon.com"}}'

  aws dynamodb put-item --table-name Person $LOCAL --item \
      '{"id": {"S": "1002"}, "location": {"S": "Omaha, NE"}, "first_name": {"S": "Wallen"}, "last_name": {"S": "Buff"}, "net_worth": {"N": "72"}, "source_of_wealth": {"S": "Berkshire"}}'

  aws dynamodb put-item --table-name Person $LOCAL --item \
      '{"id": {"S": "1003"}, "location": {"S": "NYC, NY"}, "first_name": {"S": "Jack"}, "last_name": {"S": "Smith"}, "net_worth": {"N": "60"}, "source_of_wealth": {"S": "Unkown"}}'


# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SampleData.CreateTables.html

aws dynamodb delete-table $LOCAL \
    --table-name ProductCatalog

aws dynamodb create-table \
    $LOCAL \
    --table-name ProductCatalog \
    --attribute-definitions \
        AttributeName=Id,AttributeType=N \
    --key-schema \
        AttributeName=Id,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb delete-table $LOCAL \
    --table-name Forum

aws dynamodb create-table \
    $LOCAL \
    --table-name Forum \
    --attribute-definitions \
        AttributeName=Name,AttributeType=S \
    --key-schema \
        AttributeName=Name,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

aws dynamodb delete-table $LOCAL \
    --table-name Thread

# https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html
aws dynamodb create-table \
    $LOCAL \
    --table-name Thread \
    --attribute-definitions \
        AttributeName=ForumName,AttributeType=S \
        AttributeName=Subject,AttributeType=S \
        AttributeName=LastPostDateTime,AttributeType=S \
    --key-schema \
        AttributeName=ForumName,KeyType=HASH \
        AttributeName=Subject,KeyType=RANGE \
    --global-secondary-indexes \
       IndexName=LastPostIndex,KeySchema=["\
       {AttributeName=ForumName,KeyType=HASH}","\
       {AttributeName=LastPostDateTime,KeyType=RANGE}"],Projection="\
       {ProjectionType=ALL}",ProvisionedThroughput="\
       {ReadCapacityUnits=5,WriteCapacityUnits=5}" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --tags \
        Key=Owner,Value=BlueTeam

aws dynamodb delete-table $LOCAL \
            --table-name Reply

aws dynamodb create-table $LOCAL \
    --table-name Reply \
    --attribute-definitions \
        AttributeName=Id,AttributeType=S \
        AttributeName=ReplyDateTime,AttributeType=S \
        AttributeName=PostedBy,AttributeType=S \
        AttributeName=Message,AttributeType=S \
    --key-schema AttributeName=Id,KeyType=HASH \
        AttributeName=ReplyDateTime,KeyType=RANGE \
    --global-secondary-indexes \
        IndexName=PostedBy-Message-Index,KeySchema=["\
        {AttributeName=PostedBy,KeyType=HASH}","\
        {AttributeName=Message,KeyType=RANGE}"],Projection="{ProjectionType=INCLUDE \
        ,NonKeyAttributes=["ReplyDateTime"]}",ProvisionedThroughput="\
        {ReadCapacityUnits=10,WriteCapacityUnits=10}" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=4


# data loading

aws dynamodb batch-write-item $LOCAL --request-items file://ProductCatalog.json
aws dynamodb batch-write-item $LOCAL --request-items file://Forum.json
aws dynamodb batch-write-item $LOCAL --request-items file://Thread.json
aws dynamodb batch-write-item $LOCAL --request-items file://Reply.json
